<?php 
class Mage_Catalog_Block_Product_Manufacturer extends Mage_Catalog_Block_Product_List{
    protected function _getProductCollection(){
        if (is_null($this->_productCollection)) {
            
            $bid = $this->getManufacturer(); // the brand / manufacturer ID
            $collection = Mage::getResourceModel('catalog/product_collection');
            $collection->setVisibility(Mage::getSingleton('catalog/product_visibility')->getVisibleInCatalogIds());
            
            $collection = $this->_addProductAttributesAndPrices($collection)
                ->addStoreFilter()
                ->addAttributeToFilter('manufacturer', array('in' => array($bid)));
            $this->_productCollection = $collection;
        }
        return $this->_productCollection;
    }
}
?> 