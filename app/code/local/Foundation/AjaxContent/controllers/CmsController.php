<?php

class Foundation_AjaxContent_CmsController extends Mage_Core_Controller_Front_Action {
    public function blockAction() {
        $cms_block  = (int) $this->getRequest()->getParam('id');
        $this->loadLayout();
        $myBlock = $this->getLayout()->createBlock('cms/block')->setBlockId($cms_block);
        $myHtml =  $myBlock->toHtml(); //also consider $myBlock->renderView();
        $this->getResponse()
            ->setHeader('Content-Type', 'text/html')
            ->setBody($myHtml);
        return;
    }
}
?>