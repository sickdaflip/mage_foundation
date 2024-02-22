var productAddToCartForm = new VarienForm('product_addtocart_form');
productAddToCartForm.submit = function (button, url) {
    if (this.validator.validate()) {
        var form = this.form;
        var oldUrl = form.action;

        if (url) {
            form.action = url;
        }
        var e = null;
        if (!url) {
            url = jQuery('#product_addtocart_form').attr('action');
        }
        url = url.replace("checkout/cart", "ajax/cart");
        var data = jQuery('#product_addtocart_form').serialize();
        data += '&isAjax=1';
        jQuery('.please-wait').show();
        try {
            jQuery.ajax({
                url: url,
                dataType: 'json',
                type: 'post',
                data: data,
                success: function (data) {
                    jQuery('.please-wait').hide();
                    //console.log(data);
                    if (jQuery('.off-canvas_cart')) {
                        jQuery('.off-canvas_cart').replaceWith(data.sidecart);
                    }
                    if (jQuery('.header-bottom .account .menu')) {
                        jQuery('.header-bottom .account .menu').replaceWith(data.toplink);
                    }
                    if (jQuery('#productAddToCartModal .qty span')) {
                        jQuery('#productAddToCartModal .qty span').html(data.qty);
                    }
                    jQuery('#offCanvasRightCart').foundation('open');
                }
            });
        } catch (e) {
        }
        this.form.action = oldUrl;
        if (e) {
            throw e;
        }
    }
}.bind(productAddToCartForm);

productAddToCartForm.submitLight = function (button, url) {
    if (this.validator) {
        var nv = Validation.methods;
        delete Validation.methods['required-entry'];
        delete Validation.methods['validate-one-required'];
        delete Validation.methods['validate-one-required-by-name'];
        // Remove custom datetime validators
        for (var methodName in Validation.methods) {
            if (methodName.match(/^validate-datetime-.*/i)) {
                delete Validation.methods[methodName];
            }
        }

        if (this.validator.validate()) {
            if (url) {
                this.form.action = url;
            }
            this.form.submit();
        }
        Object.extend(Validation.methods, nv);
    }
}.bind(productAddToCartForm);

var productUpdateToCartForm = new VarienForm('product_addtocart_form');
productUpdateToCartForm.submit = function (button, url) {
    if (this.validator.validate()) {
        var form = this.form;
        var oldUrl = form.action;

        if (url) {
            form.action = url;
        }
        var e = null;
        if (!url) {
            url = jQuery('#product_addtocart_form').attr('action');
        }
        url = url.replace("checkout/cart", "ajax/cart");
        var data = jQuery('#product_addtocart_form').serialize();
        data += '&isAjax=1';
        jQuery('.please-wait').show();
        try {
            jQuery.ajax({
                url: url,
                dataType: 'json',
                type: 'post',
                data: data,
                success: function (data) {
                    jQuery('.please-wait').hide();
                    //console.log(data);
                    if (jQuery('.off-canvas_cart')) {
                        jQuery('.off-canvas_cart').replaceWith(data.sidecart);
                    }
                    if (jQuery('.header-bottom .account .menu')) {
                        jQuery('.header-bottom .account .menu').replaceWith(data.toplink);
                    }
                    jQuery('#productUpdateToCartModal').foundation('open');
                }
            });
        } catch (e) {
        }
        this.form.action = oldUrl;
        if (e) {
            throw e;
        }
    }
}.bind(productUpdateToCartForm);

productUpdateToCartForm.submitLight = function (button, url) {
    if (this.validator) {
        var nv = Validation.methods;
        delete Validation.methods['required-entry'];
        delete Validation.methods['validate-one-required'];
        delete Validation.methods['validate-one-required-by-name'];
        // Remove custom datetime validators
        for (var methodName in Validation.methods) {
            if (methodName.match(/^validate-datetime-.*/i)) {
                delete Validation.methods[methodName];
            }
        }

        if (this.validator.validate()) {
            if (url) {
                this.form.action = url;
            }
            this.form.submit();
        }
        Object.extend(Validation.methods, nv);
    }
}.bind(productUpdateToCartForm);

function productRemoveFromCart(url) {
    var e = null;
    url = url.replace("checkout/cart", "ajax/cart");
    var data = url;
    data += '&isAjax=1';
    jQuery('.please-wait').show();
    try {
        jQuery.ajax({
            url: url,
            dataType: 'json',
            type: 'post',
            data: data,
            success: function (data) {
                jQuery('.please-wait').hide();
                console.log(data);
                if (jQuery('.off-canvas_cart')) {
                    jQuery('.off-canvas_cart').replaceWith(data.sidecart);
                }
                if (jQuery('.header-bottom .account .menu')) {
                    jQuery('.header-bottom .account .menu').replaceWith(data.toplink);
                }
                if (jQuery('#productAddToCartModal .qty span')) {
                    jQuery('#productAddToCartModal .qty span').html(data.qty);
                }
            }
        });
    } catch (e) {
    }
}
