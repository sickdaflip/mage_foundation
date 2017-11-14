<?php

class Foundation_Layout_Helper_Data extends Mage_Core_Helper_Abstract{
    public function getIsActive(){
        return Mage::getStoreConfig('layoutsection/layoutgroup/theme');
    }
}