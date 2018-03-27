<?php
class Mage_Catalog_Block_Product_Bestseller extends Mage_Catalog_Block_Product_List{
    protected function _getProductCollection(){
            $_productCollection = Mage::getModel('catalog/product')
                ->getCollection()
                ->addStoreFilter()
                ->addAttributeToSelect('*')
                ->addAttributeToFilter('entity_id', array('in' => array(21112,20840,23543,28850,32869,28603,18084,21028,21079,20846,16024,9450,7854,32394,10150,28636)));

            return $_productCollection;
    }
}
?>