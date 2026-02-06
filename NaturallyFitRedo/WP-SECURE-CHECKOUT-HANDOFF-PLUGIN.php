<?php
/**
 * Plugin Name: Naturally Fit Secure Checkout Handoff
 * Description: Receives signed Next.js cart payloads and redirects to Woo checkout with optional signed price locks.
 * Version: 0.2.0
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_post_nopriv_nf_secure_checkout_handoff', 'nfsch_handle_handoff');
add_action('admin_post_nf_secure_checkout_handoff', 'nfsch_handle_handoff');

function nfsch_get_secret() {
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

function nfsch_base64url_decode($input) {
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

function nfsch_fail($message) {
    if (function_exists('wc_add_notice')) {
        wc_add_notice($message, 'error');
    }

    $fallback_url = function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/');
    wp_safe_redirect($fallback_url);
    exit;
}

function nfsch_parse_positive_int($value) {
    if (!is_numeric($value)) {
        return null;
    }

    $number = (int) $value;
    if ($number <= 0) {
        return null;
    }

    return $number;
}

function nfsch_parse_positive_decimal($value) {
    if (!is_numeric($value)) {
        return null;
    }

    $number = (float) $value;
    if ($number <= 0) {
        return null;
    }

    return $number;
}

function nfsch_apply_price_overrides($cart) {
    if (!is_object($cart) || !method_exists($cart, 'get_cart')) {
        return;
    }

    foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
        if (
            !is_array($cart_item) ||
            !isset($cart_item['nfsch_unit_price']) ||
            !isset($cart_item['data']) ||
            !is_object($cart_item['data']) ||
            !method_exists($cart_item['data'], 'set_price')
        ) {
            continue;
        }

        $price = nfsch_parse_positive_decimal($cart_item['nfsch_unit_price']);
        if ($price === null) {
            continue;
        }

        $cart_item['data']->set_price($price);
    }
}
add_action('woocommerce_before_calculate_totals', 'nfsch_apply_price_overrides', 20, 1);

function nfsch_handle_handoff() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        nfsch_fail('Invalid checkout handoff method.');
    }

    if (!function_exists('WC')) {
        wp_die('WooCommerce is required for checkout handoff.');
    }

    $secret = nfsch_get_secret();
    if ($secret === '') {
        nfsch_fail('Checkout handoff is not configured.');
    }

    $payload_encoded = isset($_POST['payload']) ? sanitize_text_field(wp_unslash($_POST['payload'])) : '';
    $signature = isset($_POST['signature']) ? sanitize_text_field(wp_unslash($_POST['signature'])) : '';

    if ($payload_encoded === '' || $signature === '') {
        nfsch_fail('Missing checkout handoff data.');
    }

    $expected_signature = hash_hmac('sha256', $payload_encoded, $secret);
    if (!hash_equals($expected_signature, $signature)) {
        nfsch_fail('Invalid checkout handoff signature.');
    }

    $payload_json = nfsch_base64url_decode($payload_encoded);
    if ($payload_json === false) {
        nfsch_fail('Invalid checkout handoff payload encoding.');
    }

    $payload = json_decode($payload_json, true);
    if (!is_array($payload)) {
        nfsch_fail('Invalid checkout handoff payload.');
    }

    $now = time();
    $exp = isset($payload['exp']) ? (int) $payload['exp'] : 0;
    if ($exp <= 0 || $exp < $now) {
        nfsch_fail('Checkout handoff has expired.');
    }

    $items = isset($payload['items']) && is_array($payload['items']) ? $payload['items'] : array();
    if (empty($items)) {
        nfsch_fail('No products were provided for checkout.');
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

        $product_id = nfsch_parse_positive_int($item['productId'] ?? null);
        $quantity = nfsch_parse_positive_int($item['quantity'] ?? null);
        $variation_id = nfsch_parse_positive_int($item['variationId'] ?? null);
        $unit_price = nfsch_parse_positive_decimal($item['unitPrice'] ?? null);

        if (!$product_id || !$quantity) {
            continue;
        }

        $cart_item_data = array();
        if ($unit_price !== null) {
            $cart_item_data['nfsch_unit_price'] = wc_format_decimal($unit_price, 2);
        }

        $added = WC()->cart->add_to_cart(
            $product_id,
            $quantity,
            $variation_id ? $variation_id : 0,
            array(),
            $cart_item_data
        );

        if (!$added) {
            nfsch_fail('One or more products could not be added to checkout.');
        }
    }

    if (WC()->cart->is_empty()) {
        nfsch_fail('No valid products were added to checkout.');
    }

    WC()->cart->calculate_totals();
    wp_safe_redirect(wc_get_checkout_url());
    exit;
}
