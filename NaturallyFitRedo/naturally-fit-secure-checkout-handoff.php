<?php
/**
 * Plugin Name: Naturally Fit Secure Checkout Handoff
 * Description: Receives signed Next.js cart payloads and redirects to Woo checkout with optional signed price locks.
 * Version: 0.3.0
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_post_nopriv_nf_secure_checkout_handoff', 'nfsch_handle_handoff');
add_action('admin_post_nf_secure_checkout_handoff', 'nfsch_handle_handoff');
add_action('template_redirect', 'nfsch_maybe_redirect_after_order_received', 20);
add_filter('woocommerce_package_rates', 'nfsch_add_wholesale_shipping_rate', 20, 2);
add_filter('woocommerce_shipping_chosen_method', 'nfsch_force_wholesale_shipping_rate', 20, 3);
add_action('woocommerce_checkout_create_order', 'nfsch_mark_wholesale_order_meta', 20, 2);

function nfsch_get_wholesale_rate_id() {
    return 'nfsch_wholesale_shipping';
}

function nfsch_get_wholesale_session_key() {
    return 'nfsch_handoff_is_wholesale';
}

function nfsch_get_wholesale_role_session_key() {
    return 'nfsch_handoff_wholesale_role';
}

function nfsch_clear_handoff_context() {
    if (!function_exists('WC') || null === WC()->session) {
        return;
    }

    WC()->session->__unset('nfsch_handoff_started');
    WC()->session->__unset(nfsch_get_wholesale_session_key());
    WC()->session->__unset(nfsch_get_wholesale_role_session_key());
}

function nfsch_is_handoff_window_active() {
    if (!function_exists('WC') || null === WC()->session) {
        return false;
    }

    $handoff_started = WC()->session->get('nfsch_handoff_started');
    if (!is_numeric($handoff_started)) {
        nfsch_clear_handoff_context();
        return false;
    }

    $handoff_started_ts = (int) $handoff_started;
    $handoff_age = time() - $handoff_started_ts;
    if ($handoff_started_ts <= 0 || $handoff_age < 0 || $handoff_age > DAY_IN_SECONDS) {
        nfsch_clear_handoff_context();
        return false;
    }

    return true;
}

function nfsch_is_wholesale_handoff_session() {
    if (!nfsch_is_handoff_window_active()) {
        return false;
    }

    if (!function_exists('WC') || null === WC()->session) {
        return false;
    }

    return WC()->session->get(nfsch_get_wholesale_session_key()) === 'yes';
}

function nfsch_get_wholesale_role_for_handoff() {
    if (!function_exists('WC') || null === WC()->session) {
        return '';
    }

    $role = WC()->session->get(nfsch_get_wholesale_role_session_key());
    return is_string($role) ? $role : '';
}

function nfsch_set_handoff_context($payload) {
    if (!function_exists('WC') || null === WC()->session) {
        return;
    }

    $is_wholesale = false;
    $role = '';

    if (is_array($payload) && isset($payload['user']) && is_array($payload['user'])) {
        $is_wholesale = !empty($payload['user']['isWholesale']);

        if (isset($payload['user']['role']) && is_string($payload['user']['role'])) {
            $role = sanitize_text_field($payload['user']['role']);
        }
    }

    WC()->session->set('nfsch_handoff_started', time());
    WC()->session->set(nfsch_get_wholesale_session_key(), $is_wholesale ? 'yes' : 'no');
    WC()->session->set(nfsch_get_wholesale_role_session_key(), $role);
}

function nfsch_add_wholesale_shipping_rate($rates, $package = array()) {
    if (!nfsch_is_wholesale_handoff_session()) {
        return $rates;
    }

    if (!is_array($rates) || !class_exists('WC_Shipping_Rate')) {
        return $rates;
    }

    $rate_id = nfsch_get_wholesale_rate_id();
    $wholesale_rate = new WC_Shipping_Rate(
        $rate_id,
        __('Wholesale Shipping (Billed Later)', 'naturally-fit'),
        0,
        array(),
        'nfsch_wholesale'
    );
    if (method_exists($wholesale_rate, 'set_taxes')) {
        $wholesale_rate->set_taxes(array());
    }

    $filtered_rates = array();
    foreach ($rates as $existing_rate_id => $existing_rate) {
        if ((string) $existing_rate_id === $rate_id) {
            continue;
        }
        $filtered_rates[$existing_rate_id] = $existing_rate;
    }

    return array($rate_id => $wholesale_rate) + $filtered_rates;
}

function nfsch_force_wholesale_shipping_rate($chosen_method, $available_methods, $package_key = null) {
    if (!nfsch_is_wholesale_handoff_session()) {
        return $chosen_method;
    }

    $rate_id = nfsch_get_wholesale_rate_id();
    if (is_array($available_methods) && isset($available_methods[$rate_id])) {
        return $rate_id;
    }

    return $chosen_method;
}

function nfsch_mark_wholesale_order_meta($order, $data = array()) {
    if (!nfsch_is_wholesale_handoff_session()) {
        return;
    }

    if (!is_object($order) || !method_exists($order, 'update_meta_data')) {
        return;
    }

    $order->update_meta_data('_is_wholesale_order', 'yes');

    $role = nfsch_get_wholesale_role_for_handoff();
    if ($role !== '') {
        $order->update_meta_data('_wholesale_customer_role', $role);
    }
}

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

function nfsch_get_storefront_url() {
    if (defined('NF_STOREFRONT_URL') && NF_STOREFRONT_URL) {
        return untrailingslashit(NF_STOREFRONT_URL);
    }

    $env_url = getenv('NF_STOREFRONT_URL');
    if (is_string($env_url) && $env_url !== '') {
        return untrailingslashit($env_url);
    }

    $option_url = get_option('nf_storefront_url', '');
    if (is_string($option_url) && $option_url !== '') {
        return untrailingslashit($option_url);
    }

    return '';
}

function nfsch_build_storefront_return_url() {
    $storefront_url = nfsch_get_storefront_url();
    if ($storefront_url === '') {
        return '';
    }

    $query_args = array(
        'nf_checkout' => 'success',
    );

    $order_id = absint(get_query_var('order-received'));
    if ($order_id > 0) {
        $query_args['nf_order_id'] = $order_id;
    }

    return add_query_arg($query_args, $storefront_url . '/cart');
}

function nfsch_maybe_redirect_after_order_received() {
    if (!function_exists('is_order_received_page') || !is_order_received_page()) {
        return;
    }

    if (!function_exists('WC') || null === WC()->session) {
        return;
    }

    $handoff_started = WC()->session->get('nfsch_handoff_started');
    if (!is_numeric($handoff_started)) {
        nfsch_clear_handoff_context();
        return;
    }

    $handoff_started_ts = (int) $handoff_started;
    $handoff_age = time() - $handoff_started_ts;
    if ($handoff_started_ts <= 0 || $handoff_age < 0 || $handoff_age > DAY_IN_SECONDS) {
        nfsch_clear_handoff_context();
        return;
    }

    nfsch_clear_handoff_context();

    $redirect_url = nfsch_build_storefront_return_url();
    if ($redirect_url === '') {
        return;
    }

    wp_redirect($redirect_url);
    exit;
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
    nfsch_set_handoff_context($payload);
    wp_safe_redirect(wc_get_checkout_url());
    exit;
}
