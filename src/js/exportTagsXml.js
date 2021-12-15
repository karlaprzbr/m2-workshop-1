console.log('exportTagsXml.js')

var tagsList = []

window.addEventListener('load', function() {
  const tags = document.getElementsByClassName('tag')
  const array = Object.values(tags)

  array.forEach(element => {
      element.addEventListener('click', function(event) {
          createTagXml(element.id, element.className)
      })
  });
  
  document.getElementById('export').addEventListener('click', function() {
    const url = this.href
    exporter(url)
  })
})

const createTagXml = (audioName, tagName) => {
  var tag = {
      'audio':audioName,
      'type':tagName,
      'date':new Date().toString()
  }
  tagsList.push(tag)
  jsonToXml(tagsList);
}

const jsonToXml = (list) => {
  var xmlString = '<root></root>';
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlString, "text/xml");
  var root = xmlDoc.getElementsByTagName('root')[0];
  list.forEach(tag => {
    var xmlTag = xmlDoc.createElement('tag')
    var xmlType = xmlDoc.createElement('type')
    var xmlAudio = xmlDoc.createElement('audio')
    var xmlDate = xmlDoc.createElement('date')
    xmlType.textContent = tag.type
    xmlAudio.textContent = tag.audio
    xmlDate.textContent = tag.date
    root.appendChild(xmlTag)
    xmlTag.appendChild(xmlType)
    xmlTag.appendChild(xmlAudio)
    xmlTag.appendChild(xmlDate)
  });
  var xml = new XMLSerializer().serializeToString(xmlDoc);
  var blob = new Blob([xml], {
    type: "text/xml"
  });
  var url = window.URL.createObjectURL(blob);
  document.getElementById('export').href = url;
}

const exporter = (url) => {
  window.open(url);
}