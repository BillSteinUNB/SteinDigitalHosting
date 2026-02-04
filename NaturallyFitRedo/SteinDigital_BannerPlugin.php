<?php
/**
 * Plugin Name: SteinDigital Banner Plugin
 * Plugin URI: https://steindigital.ca
 * Description: Custom post type for managing homepage banners with REST API support for headless WordPress
 * Version: 1.0.0
 * Author: Stein Digital
 * Author URI: https://steindigital.ca
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: steindigital-banners
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Custom Post Type: Banners
 */
function steindigital_register_banners_post_type() {
    $labels = array(
        'name'                  => _x('Banners', 'Post type general name', 'steindigital-banners'),
        'singular_name'         => _x('Banner', 'Post type singular name', 'steindigital-banners'),
        'menu_name'             => _x('Banners', 'Admin Menu text', 'steindigital-banners'),
        'name_admin_bar'        => _x('Banner', 'Add New on Toolbar', 'steindigital-banners'),
        'add_new'               => __('Add New Banner', 'steindigital-banners'),
        'add_new_item'          => __('Add New Banner', 'steindigital-banners'),
        'new_item'              => __('New Banner', 'steindigital-banners'),
        'edit_item'             => __('Edit Banner', 'steindigital-banners'),
        'view_item'             => __('View Banner', 'steindigital-banners'),
        'all_items'             => __('All Banners', 'steindigital-banners'),
        'search_items'          => __('Search Banners', 'steindigital-banners'),
        'parent_item_colon'     => __('Parent Banner:', 'steindigital-banners'),
        'not_found'             => __('No banners found.', 'steindigital-banners'),
        'not_found_in_trash'    => __('No banners found in Trash.', 'steindigital-banners'),
        'featured_image'        => _x('Banner Image', 'Overrides the "Featured Image" phrase', 'steindigital-banners'),
        'set_featured_image'    => _x('Set banner image', 'Overrides the "Set featured image" phrase', 'steindigital-banners'),
        'remove_featured_image' => _x('Remove banner image', 'Overrides the "Remove featured image" phrase', 'steindigital-banners'),
        'use_featured_image'    => _x('Use as banner image', 'Overrides the "Use as featured image" phrase', 'steindigital-banners'),
    );

    $args = array(
        'labels'                => $labels,
        'description'           => __('Homepage banners for headless WordPress', 'steindigital-banners'),
        'public'                => false,
        'publicly_queryable'    => false,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 20,
        'menu_icon'             => 'dashicons-images-alt2',
        'capability_type'       => 'post',
        'has_archive'           => false,
        'hierarchical'          => false,
        'supports'              => array('title', 'thumbnail', 'page-attributes'),
        'show_in_rest'          => true,
        'rest_base'             => 'banners',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );

    register_post_type('banners', $args);
}
add_action('init', 'steindigital_register_banners_post_type', 0);

/**
 * Register Banner Type Taxonomy
 */
function steindigital_register_banner_type_taxonomy() {
    $labels = array(
        'name'                       => _x('Banner Types', 'Taxonomy general name', 'steindigital-banners'),
        'singular_name'              => _x('Banner Type', 'Taxonomy singular name', 'steindigital-banners'),
        'search_items'               => __('Search Banner Types', 'steindigital-banners'),
        'all_items'                  => __('All Banner Types', 'steindigital-banners'),
        'parent_item'                => __('Parent Banner Type', 'steindigital-banners'),
        'parent_item_colon'          => __('Parent Banner Type:', 'steindigital-banners'),
        'edit_item'                  => __('Edit Banner Type', 'steindigital-banners'),
        'update_item'                => __('Update Banner Type', 'steindigital-banners'),
        'add_new_item'               => __('Add New Banner Type', 'steindigital-banners'),
        'new_item_name'              => __('New Banner Type Name', 'steindigital-banners'),
        'menu_name'                  => __('Banner Types', 'steindigital-banners'),
    );

    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => true,
        'public'                     => false,
        'show_ui'                    => true,
        'show_admin_column'          => true,
        'show_in_rest'               => true,
        'rest_base'                  => 'banner_type',
        'rest_controller_class'      => 'WP_REST_Terms_Controller',
    );

    register_taxonomy('banner_type', array('banners'), $args);
}
add_action('init', 'steindigital_register_banner_type_taxonomy', 0);

/**
 * Add Custom Meta Box for Banner Link
 */
function steindigital_add_banner_link_meta_box() {
    add_meta_box(
        'steindigital_banner_link_meta_box',
        __('Banner Link URL', 'steindigital-banners'),
        'steindigital_render_banner_link_meta_box',
        'banners',
        'side',
        'high'
    );
}
add_action('add_meta_boxes', 'steindigital_add_banner_link_meta_box');

/**
 * Render Banner Link Meta Box
 */
function steindigital_render_banner_link_meta_box($post) {
    // Add nonce for security
    wp_nonce_field('steindigital_banner_link_meta_box', 'steindigital_banner_link_meta_box_nonce');
    
    // Get existing value
    $value = get_post_meta($post->ID, 'banner_link', true);
    
    // Field HTML
    ?>
    <p>
        <label for="banner_link" style="display: block; margin-bottom: 5px; font-weight: 600;">
            <?php _e('Where should this banner link to?', 'steindigital-banners'); ?>
        </label>
        <input 
            type="text" 
            id="banner_link" 
            name="banner_link" 
            value="<?php echo esc_attr($value); ?>" 
            style="width: 100%;" 
            placeholder="/shop or https://example.com"
        >
        <span class="description" style="font-size: 12px; color: #666;">
            <?php _e('Enter a URL like /shop or https://...', 'steindigital-banners'); ?>
        </span>
    </p>
    <?php
}

/**
 * Save Banner Link Meta Box Data
 */
function steindigital_save_banner_link_meta($post_id) {
    // Check if nonce is set
    if (!isset($_POST['steindigital_banner_link_meta_box_nonce'])) {
        return;
    }

    // Verify nonce
    if (!wp_verify_nonce($_POST['steindigital_banner_link_meta_box_nonce'], 'steindigital_banner_link_meta_box')) {
        return;
    }

    // Check autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Check permissions
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // Save the data
    if (isset($_POST['banner_link'])) {
        $banner_link = sanitize_text_field($_POST['banner_link']);
        update_post_meta($post_id, 'banner_link', $banner_link);
    }
}
add_action('save_post', 'steindigital_save_banner_link_meta');

/**
 * Register banner_link meta field in REST API
 */
function steindigital_register_banner_link_rest_field() {
    register_rest_field('banners', 'meta', array(
        'get_callback' => function($post) {
            return array(
                'banner_link' => get_post_meta($post['id'], 'banner_link', true),
            );
        },
        'update_callback' => null,
        'schema' => null,
    ));
}
add_action('rest_api_init', 'steindigital_register_banner_link_rest_field');

/**
 * Add custom admin columns for Banners list
 */
function steindigital_set_banners_columns($columns) {
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['title'] = $columns['title'];
    $new_columns['featured_image'] = __('Banner Preview', 'steindigital-banners');
    $new_columns['banner_type'] = __('Banner Type', 'steindigital-banners');
    $new_columns['banner_link'] = __('Link URL', 'steindigital-banners');
    $new_columns['menu_order'] = __('Order', 'steindigital-banners');
    $new_columns['date'] = $columns['date'];
    return $new_columns;
}
add_filter('manage_banners_posts_columns', 'steindigital_set_banners_columns');

/**
 * Populate custom admin columns
 */
function steindigital_custom_banners_column($column, $post_id) {
    switch ($column) {
        case 'featured_image':
            if (has_post_thumbnail($post_id)) {
                echo get_the_post_thumbnail($post_id, array(100, 100));
            } else {
                echo '<span style="color: #999;">' . __('No image', 'steindigital-banners') . '</span>';
            }
            break;
            
        case 'banner_type':
            $terms = get_the_terms($post_id, 'banner_type');
            if ($terms && !is_wp_error($terms)) {
                $type_names = array();
                foreach ($terms as $term) {
                    $type_names[] = esc_html($term->name);
                }
                echo implode(', ', $type_names);
            } else {
                echo '<span style="color: #999;">' . __('Not set', 'steindigital-banners') . '</span>';
            }
            break;
            
        case 'banner_link':
            $link = get_post_meta($post_id, 'banner_link', true);
            if ($link) {
                echo esc_html($link);
            } else {
                echo '<span style="color: #999;">' . __('Not set', 'steindigital-banners') . '</span>';
            }
            break;
            
        case 'menu_order':
            $order = get_post_field('menu_order', $post_id);
            echo $order;
            break;
    }
}
add_action('manage_banners_posts_custom_column', 'steindigital_custom_banners_column', 10, 2);

/**
 * Create default banner types on plugin activation
 */
function steindigital_create_default_banner_types() {
    $banner_types = array(
        'hero'            => __('Hero Slide', 'steindigital-banners'),
        'mini-1'          => __('Mini Banner Left', 'steindigital-banners'),
        'mini-2'          => __('Mini Banner Middle', 'steindigital-banners'),
        'mini-3'          => __('Mini Banner Right', 'steindigital-banners'),
        'mini-4'          => __('Medium Banner', 'steindigital-banners'),
        'product-banner'  => __('Product Banner', 'steindigital-banners'),
    );

    foreach ($banner_types as $slug => $name) {
        if (!term_exists($slug, 'banner_type')) {
            wp_insert_term($name, 'banner_type', array(
                'slug' => $slug,
                'description' => sprintf(__('Use for %s position', 'steindigital-banners'), $name),
            ));
        }
    }
}
register_activation_hook(__FILE__, 'steindigital_create_default_banner_types');

/**
 * Add admin notice after plugin activation
 */
function steindigital_activation_admin_notice() {
    $screen = get_current_screen();
    if ($screen && $screen->id === 'edit-banners') {
        ?>
        <div class="notice notice-success is-dismissible">
            <p>
                <strong><?php _e('SteinDigital Banner Plugin is active!', 'steindigital-banners'); ?></strong>
            </p>
            <p>
                <?php _e('To get started:', 'steindigital-banners'); ?>
            </p>
            <ol>
                <li><?php _e('Click "Add New Banner" to create your first banner', 'steindigital-banners'); ?></li>
                <li><?php _e('Upload a banner image using "Set banner image"', 'steindigital-banners'); ?></li>
                <li><?php _e('Select a "Banner Type" (Hero, Mini 1-3, or Medium)', 'steindigital-banners'); ?></li>
                <li><?php _e('Add a link URL where the banner should go', 'steindigital-banners'); ?></li>
                <li><?php _e('Set the "Order" to control display position', 'steindigital-banners'); ?></li>
            </ol>
        </div>
        <?php
    }
}
add_action('admin_notices', 'steindigital_activation_admin_notice');

/**
 * Add REST API support for featured images
 */
function steindigital_add_featured_image_to_rest() {
    register_rest_field('banners', 'featured_image_url', array(
        'get_callback' => function($post) {
            if (has_post_thumbnail($post['id'])) {
                $image = wp_get_attachment_image_src(get_post_thumbnail_id($post['id']), 'full');
                return $image ? $image[0] : null;
            }
            return null;
        },
        'schema' => null,
    ));
}
add_action('rest_api_init', 'steindigital_add_featured_image_to_rest');

/**
 * Add help text to the post type
 */
function steindigital_add_banner_help_tab() {
    $screen = get_current_screen();
    
    if ($screen && $screen->post_type === 'banners') {
        $screen->add_help_tab(array(
            'id'      => 'banner_help',
            'title'   => __('Using Banners', 'steindigital-banners'),
            'content' => 
                '<p>' . __('Banners are used to display promotional images on your homepage.', 'steindigital-banners') . '</p>' .
                '<h4>' . __('Banner Types:', 'steindigital-banners') . '</h4>' .
                '<ul>' .
                '<li><strong>' . __('Hero Slide', 'steindigital-banners') . '</strong> - ' . __('Full-width carousel slides at the top of the page', 'steindigital-banners') . '</li>' .
                '<li><strong>' . __('Mini Banner 1-3', 'steindigital-banners') . '</strong> - ' . __('Three small promotional banners', 'steindigital-banners') . '</li>' .
                '<li><strong>' . __('Medium Banner', 'steindigital-banners') . '</strong> - ' . __('Large featured banner section', 'steindigital-banners') . '</li>' .
                '<li><strong>' . __('Product Banner', 'steindigital-banners') . '</strong> - ' . __('Carousel of product/category banners', 'steindigital-banners') . '</li>' .
                '</ul>' .
                '<h4>' . __('Tips:', 'steindigital-banners') . '</h4>' .
                '<ul>' .
                '<li>' . __('Use "Order" to control which banner appears first', 'steindigital-banners') . '</li>' .
                '<li>' . __('Set a banner to Draft to hide it from the site', 'steindigital-banners') . '</li>' .
                '<li>' . __('Use relative URLs like /shop for internal links', 'steindigital-banners') . '</li>' .
                '</ul>',
        ));
    }
}
add_action('admin_head', 'steindigital_add_banner_help_tab');
