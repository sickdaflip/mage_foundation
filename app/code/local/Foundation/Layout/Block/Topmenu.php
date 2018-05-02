<?php

class Foundation_Layout_Block_Topmenu extends Mage_Page_Block_Html_Topmenu
{

    protected function _getHtml(Varien_Data_Tree_Node $menuTree, $childrenWrapClass)
    {

        if (!Mage::helper('layout')->getIsActive()) {
            return parent::_getHtml($menuTree, $childrenWrapClass);
        }

        $html = '';

        $children = $menuTree->getChildren();
        $parentLevel = $menuTree->getLevel();
        $childLevel = is_null($parentLevel) ? 0 : $parentLevel + 1;

        $counter = 1;
        $childrenCount = $children->count();

        $parentPositionClass = $menuTree->getPositionClass();
        $itemPositionClassPrefix = $parentPositionClass ? $parentPositionClass . '-' : 'nav-';

        foreach ($children as $child) {

            if ($child->getId() != "category-node-131") {

                $child->setLevel($childLevel);
                $child->setIsFirst($counter == 1);
                $child->setIsLast($counter == $childrenCount);
                $child->setPositionClass($itemPositionClassPrefix . $counter);

                $outermostClassCode = '';
                $outermostClass = $menuTree->getOutermostClass();

                if ($childLevel == 0 && $outermostClass) {
                    $outermostClassCode = ' class="' . $outermostClass . '" ';
                    $child->setClass($outermostClass);
                }

                $html .= '<li ' . $this->_getRenderedMenuItemAttributes($child) . '>'."\n";
                $html .= '<a href="' . $child->getUrl() . '">' . $this->escapeHtml($child->getName()) . '</a>'."\n";

                if ($child->hasChildren()) {
                    $html .= '<ul class="menu vertical">'."\n";
                    $html .= $this->_getHtml($child, $childrenWrapClass);
                    $html .= '</ul>'."\n";
                }
                $html .= '</li>'."\n";

                $counter++;
            }
        }
        return $html;
    }

    protected function _getMenuItemClasses(Varien_Data_Tree_Node $item)
    {
        if (!Mage::helper('layout')->getIsActive()) {
            return parent::_getMenuItemClasses($item);
        }

        $classes = array();

        $classes[] = 'level' . $item->getLevel();
        $classes[] = $item->getPositionClass();

        if ($item->getIsFirst()) {
            $classes[] = 'first';
        }

        if ($item->getIsActive()) {
            $classes[] = 'active';
        }

        if ($item->getIsLast()) {
            $classes[] = 'last';
        }

        if ($item->getClass()) {
            $classes[] = $item->getClass();
        }

        if ($item->hasChildren()) {
            $classes[] = 'has-submenu';
        }

        return $classes;
    }

    protected function _getActiveMenuItemAttributes(Varien_Data_Tree_Node $item)
    {
        $html = '';
        $attributes = $this->_getActiveItemAttributes($item);

        foreach ($attributes as $attributeName => $attributeValue) {
            $html .= ' ' . $attributeName . '="' . str_replace('"', '\"', $attributeValue) . '"';
        }

        return $html;
    }

    /**
     * Returns array of menu item's attributes
     *
     * @param Varien_Data_Tree_Node $item
     * @return array
     */
    protected function _getActiveItemAttributes(Varien_Data_Tree_Node $item)
    {
        $menuItemClasses = $this->_getActiveItemClasses($item);
        $attributes = array(
            'class' => implode(' ', $menuItemClasses)
        );

        return $attributes;
    }

    /**
     * Returns array of menu item's classes
     *
     * @param Varien_Data_Tree_Node $item
     * @return array
     */
    protected function _getActiveItemClasses(Varien_Data_Tree_Node $item)
    {
        $classes = array();

        $classes[] = 'link';

        if ($item->getIsActive()) {
            $classes[] = 'active';
        }

        return $classes;
    }
}