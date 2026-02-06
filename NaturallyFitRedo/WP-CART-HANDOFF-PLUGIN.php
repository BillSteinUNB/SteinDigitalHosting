<?php
/**
 * Plugin Name: Naturally Fit Cart Handoff
 * Description: Accepts signed cart payloads from Next.js and redirects to WooCommerce checkout.
 * Version: 0.1.0
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_post_nopriv_nf_cart_handoff', 'nf_handle_cart_handoff');
add_action('admin_post_nf_cart_handoff', 'nf_handle_cart_handoff');

function nf_get_handoff_secret() {
    if (defined('NF_WOO_HANDOFF_SECRET') && NF_WOO_HANDOFF_SECRET) {
        return NF_WOO_HANDOFF_SECRET;
    }

    $env_secret = getenv('WOO_HANDOFF_SECRET');
    if (is_string($env_secret) && $env_secret !== '') {
        return $env_secret;
    }

    $option_secret = get_option('nf_woo_handoff_secret', '');
    if (is_string($option_secret) && $option_secret !== '') {
        return $option_secret;
    }

    return '';
}

function nf_base64url_decode($input) {
    if (!is_string($input) || $input === '') {
        return false;
    }

    $remainder = strlen($input) % 4;
    if ($remainder) {
        $input .= str_repeat('=', 4 - $remainder);
    }

    $decoded = base64_decode(strtr($input, '-_', '+/'), true);
    return $decoded === false ? false : $decoded;
}

function nf_cart_handoff_fail($message) {
    if (function_exists('wc_add_notice')) {
        wc_add_notice($message, 'error');
    }

    $fallback_url = function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/');
    wp_safe_redirect($fallback_url);
    exit;
}

function nf_parse_positive_int($value) {
    if (!is_numeric($value)) {
        return null;
    }

    $number = (int) $value;
    if ($number <= 0) {
        return null;
    }

    return $number;
}

function nf_handle_cart_handoff() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        nf_cart_handoff_fail('Invalid checkout handoff method.');
    }

    if (!function_exists('WC')) {
        wp_die('WooCommerce is required for cart handoff.');
    }

    $secret = nf_get_handoff_secret();
    if ($secret === '') {
        nf_cart_handoff_fail('Checkout handoff is not configured.');
    }

    $payload_encoded = isset($_POST['payload']) ? sanitize_text_field(wp_unslash($_POST['payload'])) : '';
    $signature = isset($_POST['signature']) ? sanitize_text_field(wp_unslash($_POST['signature'])) : '';

    if ($payload_encoded === '' || $signature === '') {
        nf_cart_handoff_fail('Missing checkout handoff data.');
    }

    $expected_signature = hash_hmac('sha256', $payload_encoded, $secret);
    if (!hash_equals($expected_signature, $signature)) {
        nf_cart_handoff_fail('Invalid checkout handoff signature.');
    }

    $payload_json = nf_base64url_decode($payload_encoded);
    if ($payload_json === false) {
        nf_cart_handoff_fail('Invalid checkout handoff payload encoding.');
    }

    $payload = json_decode($payload_json, true);
    if (!is_array($payload)) {
        nf_cart_handoff_fail('Invalid checkout handoff payload.');
    }

    $now = time();
    $exp = isset($payload['exp']) ? (int) $payload['exp'] : 0;
    if ($exp <= 0 || $exp < $now) {
        nf_cart_handoff_fail('Checkout handoff has expired.');
    }

    $items = isset($payload['items']) && is_array($payload['items']) ? $payload['items'] : array();
    if (empty($items)) {
        nf_cart_handoff_fail('No products were provided for checkout.');
    }

    if (null === WC()->session) {
        WC()->initialize_session();
    }

    if (null === WC()->cart) {
        wc_load_cart();
    }

    WC()->cart->empty_cart();

    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }

        $product_id = nf_parse_positive_int($item['productId'] ?? null);
        $quantity = nf_parse_positive_int($item['quantity'] ?? null);
        $variation_id = nf_parse_positive_int($item['variationId'] ?? null);

        if (!$product_id || !$quantity) {
            continue;
        }

        $added = WC()->cart->add_to_cart(
            $product_id,
            $quantity,
            $variation_id ? $variation_id : 0
        );

        if (!$added) {
            nf_cart_handoff_fail('One or more products could not be added to checkout.');
        }
    }

    if (WC()->cart->is_empty()) {
        nf_cart_handoff_fail('No valid products were added to checkout.');
    }

    WC()->cart->calculate_totals();
    wp_safe_redirect(wc_get_checkout_url());
    exit;
}
