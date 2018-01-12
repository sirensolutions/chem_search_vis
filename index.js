export default function (kibana) {
  return new kibana.Plugin({
    uiExports: {
      visTypes: [
        'plugins/chem_search_vis/chem_search_vis'
      ]
    }

  });
}
