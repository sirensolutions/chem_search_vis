import {uiModules} from 'ui/modules';

import {FilterBarQueryFilterProvider} from 'ui/filter_bar/query_filter';


const module = uiModules.get('kibana/chem_search_vis', ['kibana']);
module.controller('ChemSearchVisController', function ($scope, Private, $http) {
  $scope.molSearchApiBaseUrl = 'https://smiles-to-fingerprint-dot-chemical-search.appspot.com';

  console.warn('chem search is loaded');

  const queryFilter = Private(FilterBarQueryFilterProvider);
  console.log('all filters...');
  console.log(queryFilter.getFilters());

  const moreLikeThisFilter = {
    meta: {
      alias: 'Compound: ' + $scope.vis.params.smiles,
      smiles: $scope.vis.params.smiles,
    },
    query: {
      more_like_this: {
        fields: [$scope.vis.params.field],
        like: $scope.vis.params.encoded_smiles,
        min_term_freq: 1,
        boost_terms: 2,
        min_doc_freq: 1,
        max_query_terms: 100,
        minimum_should_match: $scope.stringency,
      }
    }
  };

  $scope.stringency = 85; // default stringency
  $scope.min = 50; // minimum stringency
  $scope.max = 100; // maximum stringency

  $scope.createFilter = function () {

    // here you have access to parameters saved
    // on the left hand side panel
    // when editing visualisation
    // e.g. you can grab "fields" and use them to generate the filter

    $http({
      url : `${$scope.molSearchApiBaseUrl}/fingerprint`,
      // url: 'https://localhost:8009/fingerprint',
      method: 'GET',
      params: {smiles: $scope.vis.params.smiles}
    }).success(function (response) {
      console.log('fingerprint response...');
      console.log(response);

      // The following 2 statements are redundant??
      $scope.vis.params.encoded_smiles = response;
      moreLikeThisFilter.query.more_like_this.like = response;
      moreLikeThisFilter.meta.alias = `Compound: ${$scope.vis.params.smiles}`;
      moreLikeThisFilter.meta.smiles = $scope.vis.params.smiles;
      moreLikeThisFilter.meta.source = 'mol-search';
      moreLikeThisFilter.query.more_like_this.fields = [$scope.vis.params.field];
      moreLikeThisFilter.query.more_like_this.minimum_should_match = $scope.stringency;

      //
      $scope.searchCompleted = true;

      // pngDataToUrl(`${$scope.molSearchApiBaseUrl}/depict?smiles=${$scope.vis.params.smiles}`,
      pngToDataUrl(`${$scope.molSearchApiBaseUrl}/depict?smiles=${$scope.vis.params.smiles}`,
        function (base64Img) {
          const img = document.getElementById('componentDiagram');
          img.setAttribute('src', base64Img);
        });

      // $scope.currMolFilter = queryFilter.getFilters().filter((f) => f.meta.smiles);
      // if ($scope.currMolFilter[0]) {
      //   const currSmiles = $scope.currMolFilter[0].smiles;
      //   if (currSmiles) {
      //     console.log(`curr smiles to display in diagram: ${currSmiles}`);
      //     pngDataToUrl(`${$scope.molSearchBaseUrl}/depict?smiles=${currSmiles}`, function (base64Img) {
      //       const img = document.getElementById('componentDiagram');
      //       img.setAttribute('src', base64Img);
      //     });
      //   }
      // }

      queryFilter.addFilters(moreLikeThisFilter);
    });//TODO: handle errors
  };

  function pngToDataUrl(url, callback, outputFormat) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      let canvas = document.createElement('CANVAS');
      const ctx = canvas.getContext('2d');
      let dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  }
});
