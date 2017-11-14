<?php
$setup = new Mage_Eav_Model_Entity_Setup('core_setup');
$setup->startSetup();
$setup->addAttribute(Mage_Catalog_Model_Category::ENTITY, 'additional_description',
    array(
        'backend' => '',
        'global' => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_STORE,
        'group' => 'General Information',
        'input' => 'textarea',
        'label' => 'Additional Description',
        'sort_order' => 5,
        'required' => false,
        'type' => 'text',
        'user_defined' => true,
        'visible' => true,
    )
);
$setup->updateAttribute(Mage_Catalog_Model_Category::ENTITY, 'additional_description', 'is_wysiwyg_enabled', 1);
$setup->updateAttribute(Mage_Catalog_Model_Category::ENTITY, 'additional_description', 'is_html_allowed_on_front', 1);
$setup->updateAttribute(Mage_Catalog_Model_Category::ENTITY, 'additional_description', 'visible_on_front', 1);
$setup->endSetup();

$setup = new Mage_Eav_Model_Entity_Setup('core_setup');
$setup->startSetup();
$setup->addAttribute(Mage_Catalog_Model_Category::ENTITY, 'additional_headline',
    array(
        'backend' => '',
        'global' => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_STORE,
        'group' => 'General Information',
        'input' => 'text',
        'label' => 'Additional Headline',
        'sort_order' => 2,
        'required' => false,
        'type' => 'text',
        'user_defined' => true,
        'visible' => true,
    )
);
$setup->updateAttribute(Mage_Catalog_Model_Category::ENTITY, 'additional_description', 'visible_on_front', 1);
$setup->endSetup();