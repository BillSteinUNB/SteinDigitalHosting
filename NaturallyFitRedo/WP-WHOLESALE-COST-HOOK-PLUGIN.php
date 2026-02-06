<?php
/**
 * Plugin Name: Naturally Fit Wholesale Cost Sync
 * Description: Sync WholesaleX product/variation base prices from MyCost using a fixed markup.
 * Version: 0.1.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Optional wp-config.php constants:
 *
 * define('NF_WHOLESALE_MARKUP_PERCENT', 20);
 * define('NF_WHOLESALE_COST_META_KEY', '_wc_cog_cost');
 * define('NF_WHOLESALEX_PRICE_META_KEY', 'wholesalex_b2b_role_123456789_base_price');
 */

function nf_wholesale_sync_get_markup_percent() {
    $percent = defined('NF_WHOLESALE_MARKUP_PERCENT') ? (float) NF_WHOLESALE_MARKUP_PERCENT : 20.0;
    if ($percent < 0) {
        $percent = 0;
    }
    return $percent;
}

function nf_wholesale_sync_cost_key_candidates() {
    $defaults = array(
        'mycost',
        '_mycost',
        'my_cost',
        '_my_cost',
        'cost',
        '_cost',
        '_wc_cog_cost',
        'wc_cog_cost',
        '_alg_wc_cog_cost',
        'alg_wc_cog_cost',
    );

    $keys = apply_filters('nf_wholesale_sync_cost_keys', $defaults);
    return is_array($keys) ? $keys : $defaults;
}

function nf_wholesale_sync_parse_money($value) {
    if ($value === null || $value === '') {
        return null;
    }

    if (is_array($value) || is_object($value)) {
        return null;
    }

    $normalized = preg_replace('/[^0-9.\-]/', '', (string) $value);
    if ($normalized === '' || !is_numeric($normalized)) {
        return null;
    }

    $number = (float) $normalized;
    if (!is_finite($number)) {
        return null;
    }

    return $number;
}

function nf_wholesale_sync_detect_wholesale_key($post_id) {
    if (defined('NF_WHOLESALEX_PRICE_META_KEY') && NF_WHOLESALEX_PRICE_META_KEY) {
        return (string) NF_WHOLESALEX_PRICE_META_KEY;
    }

    $cached = get_option('nf_wholesale_sync_wholesale_key', '');
    if (is_string($cached) && $cached !== '') {
        return $cached;
    }

    $all_meta = get_post_meta($post_id);
    if (is_array($all_meta)) {
        foreach (array_keys($all_meta) as $key) {
            if (preg_match('/^wholesalex_b2b_role_\d+_base_price$/i', (string) $key)) {
                update_option('nf_wholesale_sync_wholesale_key', (string) $key, false);
                return (string) $key;
            }
        }
    }

    global $wpdb;
    if ($wpdb instanceof wpdb) {
        $like_pattern = $wpdb->esc_like('wholesalex_b2b_role_') . '%' . $wpdb->esc_like('_base_price');
        $sql = $wpdb->prepare(
            "SELECT meta_key FROM {$wpdb->postmeta} WHERE meta_key LIKE %s LIMIT 1",
            $like_pattern
        );
        $found = $wpdb->get_var($sql); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
        if (is_string($found) && $found !== '') {
            update_option('nf_wholesale_sync_wholesale_key', $found, false);
            return $found;
        }
    }

    return '_wholesale_price';
}

function nf_wholesale_sync_detect_cost_key($post_id) {
    if (defined('NF_WHOLESALE_COST_META_KEY') && NF_WHOLESALE_COST_META_KEY) {
        return (string) NF_WHOLESALE_COST_META_KEY;
    }

    $cached = get_option('nf_wholesale_sync_cost_key', '');
    if (is_string($cached) && $cached !== '') {
        $cached_value = get_post_meta($post_id, $cached, true);
        if (nf_wholesale_sync_parse_money($cached_value) !== null) {
            return $cached;
        }
    }

    $candidate_keys = nf_wholesale_sync_cost_key_candidates();
    foreach ($candidate_keys as $key) {
        $value = get_post_meta($post_id, (string) $key, true);
        if (nf_wholesale_sync_parse_money($value) !== null) {
            update_option('nf_wholesale_sync_cost_key', (string) $key, false);
            return (string) $key;
        }
    }

    $all_meta = get_post_meta($post_id);
    if (is_array($all_meta)) {
        foreach ($all_meta as $key => $values) {
            if (!is_string($key)) {
                continue;
            }
            if (!preg_match('/(^|_)my_?cost$|(^|_)cost$/i', $key)) {
                continue;
            }
            $value = get_post_meta($post_id, $key, true);
            if (nf_wholesale_sync_parse_money($value) !== null) {
                update_option('nf_wholesale_sync_cost_key', $key, false);
                return $key;
            }
        }
    }

    return '';
}

function nf_wholesale_sync_get_cost_value($post_id, $cost_key) {
    $value = get_post_meta($post_id, $cost_key, true);
    $cost = nf_wholesale_sync_parse_money($value);
    if ($cost !== null) {
        return $cost;
    }

    if (get_post_type($post_id) === 'product_variation') {
        $parent_id = (int) wp_get_post_parent_id($post_id);
        if ($parent_id > 0) {
            $parent_value = get_post_meta($parent_id, $cost_key, true);
            $parent_cost = nf_wholesale_sync_parse_money($parent_value);
            if ($parent_cost !== null) {
                return $parent_cost;
            }
        }
    }

    return null;
}

function nf_wholesale_sync_write_price($post_id, $wholesale_key, $price) {
    $normalized = number_format((float) $price, 2, '.', '');
    update_post_meta($post_id, $wholesale_key, $normalized);
}

function nf_wholesale_sync_item($post_id) {
    if ($post_id <= 0) {
        return;
    }

    if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
        return;
    }

    $post_type = get_post_type($post_id);
    if ($post_type !== 'product' && $post_type !== 'product_variation') {
        return;
    }

    $wholesale_key = nf_wholesale_sync_detect_wholesale_key($post_id);
    $cost_key = nf_wholesale_sync_detect_cost_key($post_id);
    if ($cost_key === '') {
        return;
    }

    $cost = nf_wholesale_sync_get_cost_value($post_id, $cost_key);
    if ($cost === null) {
        return;
    }

    $markup = nf_wholesale_sync_get_markup_percent();
    $wholesale_price = round($cost * (1 + ($markup / 100)), 2);
    nf_wholesale_sync_write_price($post_id, $wholesale_key, $wholesale_price);
}

function nf_wholesale_sync_product_save($post_id, $post, $update) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    nf_wholesale_sync_item((int) $post_id);

    if (!function_exists('wc_get_product')) {
        return;
    }

    $product = wc_get_product($post_id);
    if (!$product || !$product->is_type('variable')) {
        return;
    }

    $variation_ids = $product->get_children();
    if (!is_array($variation_ids)) {
        return;
    }

    foreach ($variation_ids as $variation_id) {
        nf_wholesale_sync_item((int) $variation_id);
    }
}
add_action('save_post_product', 'nf_wholesale_sync_product_save', 20, 3);

function nf_wholesale_sync_variation_save($variation_id) {
    nf_wholesale_sync_item((int) $variation_id);
}
add_action('woocommerce_save_product_variation', 'nf_wholesale_sync_variation_save', 20, 1);

function nf_wholesale_sync_cost_meta_changed($meta_id, $post_id, $meta_key, $meta_value) {
    $post_type = get_post_type($post_id);
    if ($post_type !== 'product' && $post_type !== 'product_variation') {
        return;
    }

    $keys = array_map('strtolower', nf_wholesale_sync_cost_key_candidates());
    if (!in_array(strtolower((string) $meta_key), $keys, true)) {
        if (defined('NF_WHOLESALE_COST_META_KEY') && NF_WHOLESALE_COST_META_KEY) {
            if (strtolower((string) NF_WHOLESALE_COST_META_KEY) !== strtolower((string) $meta_key)) {
                return;
            }
        } else {
            return;
        }
    }

    nf_wholesale_sync_item((int) $post_id);
}
add_action('updated_post_meta', 'nf_wholesale_sync_cost_meta_changed', 20, 4);
add_action('added_post_meta', 'nf_wholesale_sync_cost_meta_changed', 20, 4);

