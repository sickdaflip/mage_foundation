<?php

class Foundation_Solute_Helper_Data extends Mage_Core_Helper_Abstract
{

    /**
     * retrieve requested value from order or item
     * convert from base currency if configured
     * else return order currency
     *
     * @param $object
     * @param $field
     *
     * @param $currentCurrency
     *
     * @return string
     */
    public function convert($object, $field, $currentCurrency = null)
    {
        $baseCurCode = Mage::getStoreConfig('currency/options/base', $object->getStoreId());
        $baseCur = Mage::getModel('directory/currency')->load($baseCurCode);

        //getPrice and getFinalPrice do not have base equivalents
        if ($field != 'price' && $field != 'final_price') {
            $field = 'base_' . $field;
            $baseValue = $object->getDataUsingMethod($field);
        } else {
            if (null === $currentCurrency) {
                Mage::throwException('Currency needs to be defined');
            }
            $value = $object->getDataUsingMethod($field);
            if ($currentCurrency == $baseCur->getCode()) {
                $baseValue = $value;
            } else {
                $rate = $baseCur->getRate($currentCurrency);
                $baseValue = Mage::app()->getStore()->roundPrice($value / $rate);
            }
        }

        if (!Mage::getStoreConfig('google/analyticsplus/convertcurrencyenabled')) {
            return sprintf('%01.2f', $baseValue);
        }

        return sprintf(
            "%01.2f", Mage::app()->getStore()->roundPrice(
                $baseCur->convert(
                    $baseValue,
                    Mage::getStoreConfig('google/analyticsplus/convertcurrency')
                )
            )
        );

    }

    /**
     * currency for tracking
     *
     * @param $object
     *
     * @return string
     */
    public function getTrackingCurrency($object)
    {
        if (!Mage::getStoreConfig('google/analyticsplus/convertcurrencyenabled')) {
            return $object->getBaseCurrencyCode();
        } else {
            return Mage::getStoreConfig('google/analyticsplus/convertcurrency');
        }
    }

}
