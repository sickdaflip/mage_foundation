<?php

require_once 'Mage/Checkout/controllers/CartController.php';

class Foundation_Ajax_CartController extends Mage_Checkout_CartController
{

    public function addAction()
{
    $cart = $this->_getCart();
    $params = $this->getRequest()->getParams();
    if ($params['isAjax'] == 1) {
        $response = array();
        try {
            if (isset($params['qty'])) {
                $filter = new Zend_Filter_LocalizedToNormalized(
                    array('locale' => Mage::app()->getLocale()->getLocaleCode())
                );
                $params['qty'] = $filter->filter($params['qty']);
            }

            $product = $this->_initProduct();
            $related = $this->getRequest()->getParam('related_product');

            /**
             * Check product availability
             */
            if (!$product) {
                $response['status'] = 'ERROR';
                $response['message'] = $this->__('Unable to find Product ID');
            }

            $cart->addProduct($product, $params);
            if (!empty($related)) {
                $cart->addProductsByIds(explode(',', $related));
            }

            $cart->save();

            $this->_getSession()->setCartWasUpdated(true);

            Mage::dispatchEvent('checkout_cart_add_product_complete',
                array('product' => $product, 'request' => $this->getRequest(), 'response' => $this->getResponse())
            );

            if (!$cart->getQuote()->getHasError()) {
                $message = $this->__('%s was added to your shopping cart.', Mage::helper('core')->escapeHtml($product->getName()));
                $response['status'] = 'SUCCESS';
                $response['message'] = $message;
                $this->loadLayout();
                $toplink = $this->getLayout()->getBlock('top.links')->toHtml();
                $qty = $params['qty'];
                Mage::register('referrer_url', $this->_getRefererUrl());
                $response['toplink'] = $toplink;
                $response['qty'] = $qty;
            }
        } catch (Mage_Core_Exception $e) {
            $msg = "";
            if ($this->_getSession()->getUseNotice(true)) {
                $msg = $e->getMessage();
            } else {
                $messages = array_unique(explode("\n", $e->getMessage()));
                foreach ($messages as $message) {
                    $msg .= $message . '<br/>';
                }
            }

            $response['status'] = 'ERROR';
            $response['message'] = $msg;
        } catch (Exception $e) {
            $response['status'] = 'ERROR';
            $response['message'] = $this->__('Cannot add the item to shopping cart.');
            Mage::logException($e);
        }
        $this->getResponse()->setHeader('Content-Type', 'text/html')->setBody(Mage::helper('core')->jsonEncode($response));
        return;
    } else {
        return parent::addAction();
    }
}

    public function updateItemOptionsAction()
    {
        $cart = $this->_getCart();
        $id = (int) $this->getRequest()->getParam('id');
        $params = $this->getRequest()->getParams();

        if (!isset($params['options'])) {
            $params['options'] = array();
        }

        if ($params['isAjax'] == 1) {
            $response = array();
            try {
                if (isset($params['qty'])) {
                    $filter = new Zend_Filter_LocalizedToNormalized(
                        array('locale' => Mage::app()->getLocale()->getLocaleCode())
                    );
                    $params['qty'] = $filter->filter($params['qty']);
                }

                $product = $this->_initProduct();
                $related = $this->getRequest()->getParam('related_product');

                /**
                 * Check product availability
                 */
                if (!$product) {
                    $response['status'] = 'ERROR';
                    $response['message'] = $this->__('Unable to find Product ID');
                }

                $item = $cart->updateItem($id, new Varien_Object($params));
                if (is_string($item)) {
                    Mage::throwException($item);
                }
                if ($item->getHasError()) {
                    Mage::throwException($item->getMessage());
                }

                //$cart->updateItem($product, null, $params);
                if (!empty($related)) {
                    $cart->addProductsByIds(explode(',', $related));
                }

                $cart->save();

                $this->_getSession()->setCartWasUpdated(true);

                Mage::dispatchEvent('checkout_cart_add_product_complete',
                    array('product' => $product, 'request' => $this->getRequest(), 'response' => $this->getResponse())
                );

                if (!$cart->getQuote()->getHasError()) {
                    $message = $this->__('%s was added to your shopping cart.', Mage::helper('core')->escapeHtml($product->getName()));
                    $response['status'] = 'SUCCESS';
                    $response['message'] = $message;
                    $this->loadLayout();
                    $toplink = $this->getLayout()->getBlock('top.links')->toHtml();
                    $qty = $params['qty'];
                    Mage::register('referrer_url', $this->_getRefererUrl());
                    $response['toplink'] = $toplink;
                    $response['qty'] = $qty;
                }
            } catch (Mage_Core_Exception $e) {
                $msg = "";
                if ($this->_getSession()->getUseNotice(true)) {
                    $msg = $e->getMessage();
                } else {
                    $messages = array_unique(explode("\n", $e->getMessage()));
                    foreach ($messages as $message) {
                        $msg .= $message . '<br/>';
                    }
                }

                $response['status'] = 'ERROR';
                $response['message'] = $msg;
            } catch (Exception $e) {
                $response['status'] = 'ERROR';
                $response['message'] = $this->__('Cannot add the item to shopping cart.');
                Mage::logException($e);
            }
            $this->getResponse()->setHeader('Content-Type', 'text/html')->setBody(Mage::helper('core')->jsonEncode($response));
            return;
        } else {
            return parent::addAction();
        }
    }

    public function optionsAction()
    {
        $productId = $this->getRequest()->getParam('product_id');
        // Prepare helper and params
        $viewHelper = Mage::helper('catalog/product_view');

        $params = new Varien_Object();
        $params->setCategoryId(false);
        $params->setSpecifyOptions(false);

        // Render page
        try {
            $viewHelper->prepareAndRender($productId, $this, $params);
        } catch (Exception $e) {
            if ($e->getCode() == $viewHelper->ERR_NO_PRODUCT_LOADED) {
                if (isset($_GET['store']) && !$this->getResponse()->isRedirect()) {
                    $this->_redirect('');
                } elseif (!$this->getResponse()->isRedirect()) {
                    $this->_forward('noRoute');
                }
            } else {
                Mage::logException($e);
                $this->_forward('noRoute');
            }
        }
    }
}