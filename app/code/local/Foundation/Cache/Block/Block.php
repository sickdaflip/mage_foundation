<?php

class Foundation_Cache_Block_Block extends Mage_Cms_Block_Block
{

    private function generateUrlBasedString($blockId = null)
    {
        $currentUrl = Mage::helper('core/url')->getCurrentUrl();
        $url = Mage::getSingleton('core/url')->parseUrl($currentUrl);
        $path = '_' . $url->getPath();

        $path = str_replace('/', '', $path);
        $path = str_replace('.', '', $path);
        $path = str_replace('&', '', $path);
        $path = str_replace(',', '', $path);
        $path = str_replace('=', '', $path);

        if(isset($blockId)) {
            $path .= '_' . $blockId;
        }

        return $path;
    }
    /**
     * Retrieve values of properties that unambiguously identify unique content
     *
     * @return array
     */
    public function getCacheKeyInfo()
    {
        $blockId = $this->getBlockId();
        if ($blockId) {
            $result = array(
                'CMS_BLOCK',
                $blockId,
                Mage::app()->getStore()->getCode() . $this->generateUrlBasedString($blockId),
            );
        } else {
            $result = parent::getCacheKeyInfo();
        }
        return $result;
    }

}