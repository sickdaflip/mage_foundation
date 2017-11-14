<?php
class Mage_Catalog_Block_Product_Sale extends Mage_Catalog_Block_Product_List{

    public function getProductsLimit()
    {
        if ($this->getData('limit')) {
            return intval($this->getData('limit'));
        } else {
            return 32;
        }
    }

    public function __construct()
    {
        parent::__construct();
        $collection = $this->_getProductCollection();
        $this->setCollection($collection);
    }

    protected function _getProductCollection(){
        if (is_null($this->_productCollection)) {
            $categoryID = $this->getCategoryId();
            if($categoryID)
            {
                $category = new Mage_Catalog_Model_Category();
                $category->load($categoryID); // this is category id
                $collection = $category->getProductCollection();
            } else
            {
                $collection = Mage::getResourceModel('catalog/product_collection');
            }

            $todayDate = date('m/d/y');
            $tomorrow = mktime(0, 0, 0, date('m'), date('d')+1, date('y'));
            $tomorrowDate = date('m/d/y', $tomorrow);

            Mage::getModel('catalog/layer')->prepareProductCollection($collection);
            $collection->addAttributeToSort('created_at', 'desc');
            $collection->addStoreFilter();

            $collection->addAttributeToFilter('special_from_date', array('date' => true, 'to' => $todayDate))
                ->addAttributeToFilter('special_to_date', array('or'=> array(
                    0 => array('date' => true, 'from' => $tomorrowDate),
                    1 => array('is' => new Zend_Db_Expr('null')))
                ), 'left');


            $numProducts = $this->getNumProducts() ? $this->getNumProducts() : 0;
            $collection->setPage(1, $numProducts)->load();

            $this->_productCollection = $collection;
        }
        return $this->_productCollection;
    }
}
?>