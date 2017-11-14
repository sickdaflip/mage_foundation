<?php
/**
 * @project gastrodax
 *
 * @author pbreitsprecher
 * @copyright 2017
 * @license https://opensource.org/licenses/MIT The MIT License (MIT)
 *
 * @last_modified 23.02.17 15:19
 * @file SqlBuilder.php
 *
 */

class Mage_Rule_Model_Resource_Rule_Condition_SqlBuilder
{
    /**
     * Database adapter
     *
     * @var Varien_Db_Adapter_Interface
     */
    protected $_adapter;

    /**
     * Constructor
     *
     * @param array $config
     */
    public function __construct(array $config = array())
    {
        $this->_adapter = isset($config['adapter'])
            ? $config['adapter']
            : Mage::getSingleton('core/resource')->getConnection(Mage_Core_Model_Resource::DEFAULT_READ_RESOURCE);
    }

    /**
     * Convert operator for sql where
     *
     * @param string $field
     * @param string $operator
     * @param string|array $value
     * @return string
     */
    public function getOperatorCondition($field, $operator, $value)
    {

        // CORE PATCH: Check to see if this is an (), {}, !() or !{} query, it is comma separated and it is not an array.

        if ( in_array($operator, array('()', '{}', '!()', '!{}')) && !is_array($value) && strstr($value, ',') ) {
            $value = explode(',', $value);
            $value = array_map('trim', $value);
        }

        // END CORE PATCH

        // CORE PATCH: Fix for products with few assigned values form multieselect attribute in catalog rules, regexp in SQL because in product flat table multieselect values stored as coma separated

        if (strstr($field, 'cpf.')){

            $attribute_parse = explode('.', $field);  // get attribute code ( attribute from cpf.attribute )

            $attribute = $attribute_parse[1];

            $attribute_type = Mage::getSingleton("eav/config")->getAttribute('catalog_product', $attribute)->getFrontendInput();

            if (strstr($attribute_type, 'multiselect')){

                $attribute_values = implode('|', $value);

                $result_patched = '`cpf`.`'.$attribute.'` REGEXP "(^|,)'.$attribute_values.'(,|$)"';

                return $result_patched; // return SQL for avoid future SqlBuider processing
            }

        }

        // END CORE PATCH


        switch ($operator) {
            case '!=':
            case '>=':
            case '<=':
            case '>':
            case '<':
                $selectOperator = sprintf('%s?', $operator);
                break;
            case '{}':
            case '!{}':
                // CORE PATCH: Commented out the category_id matching since any array should use this select operator.
                if (/*preg_match('/^.*(category_id)$/', $field) &&*/ is_array($value)) {
                    $selectOperator = ' IN (?)';
                } else {
                    $selectOperator = ' LIKE ?';
                    $value          = '%' . $value . '%';
                }
                if (substr($operator, 0, 1) == '!') {
                    $selectOperator = ' NOT' . $selectOperator;
                }
                break;

            case '()':
                $selectOperator = ' IN(?)';
                break;

            case '!()':
                $selectOperator = ' NOT IN(?)';
                break;

            default:
                $selectOperator = '=?';
                break;
        }
        $field = $this->_adapter->quoteIdentifier($field);

        if (is_array($value) && in_array($operator, array('==', '!=', '>=', '<=', '>', '<'))) {
            $results = array();
            foreach ($value as $v) {
                $results[] = $this->_adapter->quoteInto("{$field}{$selectOperator}", $v);
            }
            $result = implode(' AND ', $results);
        } else {
            $result = $this->_adapter->quoteInto("{$field}{$selectOperator}", $value);
        }

        return $result;
    }
}