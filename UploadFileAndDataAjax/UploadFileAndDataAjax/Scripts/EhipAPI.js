
if (!jQuery) { throw new Error("Upload File requires jQuery") }
//+function ($) {
    "use strict";
    var Ehip = {
        Init: function () {
            //<input type="file" name="files[]" multiple directory webkitdirectory>
        },
        LoadingID: 'loading',
        Token: '',
        Blob: window.Blob,
        File: window.File,
        getIframeContentJSON : function (iframe) {
            //IE may throw an "access is denied" error when attempting to access contentDocument on the iframe in some cases
            try {
                // iframe.contentWindow.document - for IE<7
                var doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document,
                    response;

                var innerHTML = doc.body.innerHTML;
                //plain text response may be wrapped in <pre> tag
                if (innerHTML.slice(0, 5).toLowerCase() == "<pre>" && innerHTML.slice(-6).toLowerCase() == "</pre>") {
                    innerHTML = doc.body.firstChild.firstChild.nodeValue;
                }
                response = eval("(" + innerHTML + ")");
            } catch (err) {
                response = { success: false };
            }

            return response;
        },
        FormData: window.FormData,
        Ajax: function (options) {
            if (Ehip.IsUndifined(options.url)) {
                alert('Url required for ajax');
                console.log('Url required for ajax');
            }
            var inputFiles = $('input[type="file"]');
            if (!Ehip.IsFormData()) {
                var iframe = document.createElement("iframe");
                iframe.setAttribute("name", "upload_iframe_mySubmitForm");
                iframe.setAttribute("id", "upload_iframe_mySubmitForm");

                iframe.setAttribute("width", "0");
                iframe.setAttribute("height", "0");
                iframe.setAttribute("border", "0");
                iframe.setAttribute("src", "javascript:false;");
                iframe.style.display = "none";

                var form = document.createElement("form");
                form.setAttribute("target", "upload_iframe_mySubmitForm");
                form.setAttribute("action", options.url);
                form.setAttribute("method", "post");
                form.setAttribute("id", "formIE9Submit");
                form.setAttribute("enctype", "multipart/form-data");
                form.setAttribute("encoding", "multipart/form-data");
                form.style.display = "none";

                if (inputFiles.length > 0) {
                    $.each(inputFiles, function (index, value) {
                        inputFiles.type = "file";
                        inputFiles.name = 'files';
                        inputFiles.id = 'files' + index;
                        form.appendChild(value);
                    });
                }

                document.body.appendChild(form);
                document.body.appendChild(iframe);
                iframeIdmyFile = document.getElementById("upload_iframe_mySubmitForm");

                // Add event...
                var eventHandlermyFile = function () {
                    if (iframeIdmyFile.detachEvent)
                        iframeIdmyFile.detachEvent("onload", eventHandlermyFile);
                    else
                        iframeIdmyFile.removeEventListener("load", eventHandlermyFile, false);

                    response = Ehip.getIframeContentJSON(iframeIdmyFile);
                    console.log(response);
                    //$('#upload_iframe_mySubmitForm').remove();
                }

                if (iframeIdmyFile.addEventListener) {
                    iframeIdmyFile.addEventListener("load", eventHandlermyFile, true);
                }
                if (iframeIdmyFile.attachEvent) {
                    iframeIdmyFile.attachEvent("onload", eventHandlermyFile);
                }

                form.submit();
                return;
            }
            //$.ajaxStart(function () {
            //    if (Ehip.LoadingID.length > 0 && $('#' + Ehip.LoadingID).length > 0) {
            //        $('#' + Ehip.LoadingID).show();
            //    }
            //});
            //$.ajaxStop(function () {
            //    if (Ehip.LoadingID.length > 0 && $('#' + Ehip.LoadingID).length > 0) {
            //        $('#' + Ehip.LoadingID).hide();
            //    }
            //});
            if (!Ehip.IsUndifined(options.data) && inputFiles.length > 0) {
                options.mimeType = 'multipart/form-data';
                options.method = 'POST';
                options.contentType = options.processData = false;

                var fd = new FormData();
                if (!Ehip.IsUndifined(options.data)) {
                    if (Ehip.IsObject(options.data)) {
                        fd.append('model', JSON.stringify(options.data));
                    }
                    else {
                        fd.append('model', options.data);
                    }
                }
             
                if (inputFiles.length > 0) {
                    $.each(inputFiles, function (index, item) {
                        $.each(item.files, function (iFile, file) {
                            fd.append('files', file);
                        });
                    });
                }
                options.data = fd;
            }
            if (Ehip.IsUndifined(options.headers)) {
                if (Ehip.Token.length > 0) {
                    options.headers = { Authorization: Ehip.Token };
                }
            }
            else {
                if (Ehip.Token.length > 0) {
                    options.headers.Authorization = Ehip.Token;
                }
            }
            this.options = {
                headers: Ehip.IsUndifined(options.headers) ? {} : options.headers,
                url: options.url,
                processData: Ehip.IsUndifined(options.processData) ? true : options.processData,
                username: Ehip.IsUndifined(options.username) ? undefined : options.username,
                password: Ehip.IsUndifined(options.password) ? undefined : options.password,
                mimeType: Ehip.IsUndifined(options.mimeType) ? undefined : options.mimeType,
                method: Ehip.IsUndifined(options.method) ? 'GET' : options.method,
                cache: Ehip.IsUndifined(options.cache) ? true : options.cache,
                global: Ehip.IsUndifined(options.global) ? true : options.global,
                async: Ehip.IsUndifined(options.async) ? true : options.async,
                data: Ehip.IsUndifined(options.data) ? {} : options.data,
                contentType: Ehip.IsUndifined(options.contentType) ? 'application/x-www-form-urlencoded; charset=UTF-8' : options.contentType,//+ '; charset=UTF-8'
                dataType: Ehip.IsUndifined(options.dataType) ? 'json' : options.dataType,
                crossDomain: Ehip.IsUndifined(options.crossDomain) ? false : options.crossDomain,
                beforeSend: function (jqXHR) {
                    if (options.processData === false && jqXHR && jqXHR.overrideMimeType) {
                        jqXHR.overrideMimeType(options.mimeType);
                    }
                    if (Ehip.IsFunction(options.beforeSend)) {
                        options.beforeSend(jqXHR);
                    }
                },
                success: function (response) {
                    if (Ehip.IsFunction(options.done)) {
                        options.done(response);
                    }
                },
                error: function (err) {
                    if (Ehip.IsFunction(options.fail)) {
                        options.fail(err);
                    }
                },
                complete: function (response) {
                    if (Ehip.IsFunction(options.complete)) {
                        options.complete(response);
                    }
                },
                statusCode: Ehip.IsUndifined(options.statusCode) ? {} : options.statusCode,
            };
            $.ajax(this.options);
        },
        IsUndifined: function (obj) {
            return obj === 'undefined';
        },
        IsObject: function (obj) {
            return typeof (obj) === 'object';
        },
        IsFunction: function (obj) {
            return typeof (obj) === 'function';
        },
        IsNull: function (obj) {
            return obj === null;
        },
        IsFormData: function () {
            return typeof Ehip.FormData !== 'undefined';
        },
        IsBlob: function () {
            return typeof Ehip.Blob !== 'undefined';
        },
        IsFile: function () {
            return typeof Ehip.File != 'undefined';
        },
        String: {
            Format: function () {
                var theString = arguments[0];
                if (theString != undefined) {
                    if (jQuery.type(arguments[1]) === 'array') {
                        for (var i = 0; i < arguments[1].length; i++) {
                            var regEx = new RegExp("\\{" + (i) + "\\}", "gm");
                            theString = theString.replace(regEx, arguments[1][i]);
                        }
                    }
                    else {
                        for (var i = 1; i < arguments.length; i++) {
                            var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
                            theString = theString.replace(regEx, arguments[i]);
                        }
                    }
                }
                else {
                    theString = '';
                }
                return theString;
            }
        }
    }
//}(window.jQuery);