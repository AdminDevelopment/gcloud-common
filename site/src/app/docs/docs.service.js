/* global hljs:true */
(function() {
  'use strict';

  angular
    .module('gcloud')
    .factory('DocsService', DocsService);

  /** @ngInject */
  function DocsService($sce, manifest) {
    function setAsTrusted(_method) {
      var method = angular.copy(_method);

      method.isConstructor = method.type === 'constructor';

      if (method.description) {
        method.description = $sce.trustAsHtml(method.description);
      }

      if (method.examples) {
        method.examples = method.examples.map(trustExample);
      }

      if (method.returns) {
        method.returns = method.returns.map(trustReturn);
      }

      if (method.params) {
        method.params = method.params.map(trustParam);
      }

      return method;
    }

    function trustReturn(returnValue) {
      return $sce.trustAsHtml(returnValue.types.join(', '));
    }

    function trustExample(example) {
      var code, caption;

      if (example.code) {
        code = hljs.highlight(manifest.markdown, example.code);
        code = $sce.trustAsHtml(code.value);
      }

      if (example.caption) {
        caption = $sce.trustAsHtml(example.caption);
      }

      return {
        code: code,
        caption: caption
      };
    }

    function trustParam(param) {
      var name = param.name.split('.');

      if (name.length > 1) {
        param.name = name.pop();
        param.parent = name.join('.');
      }

      param.types = $sce.trustAsHtml(param.types.join(', '));
      param.description = $sce.trustAsHtml(param.description);

      return param;
    }

    return {
      setAsTrusted: setAsTrusted,
      trust: $sce.trustAsHtml.bind($sce)
    };
  }

}());
