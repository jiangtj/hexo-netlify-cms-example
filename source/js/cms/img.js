/**
* Image tag
*
* Syntax:
*   {% img [class names] /path/to/image [width] [height] [title text [alt text]] %}
*/

const rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\w]*))?)/;
const rMeta = /["']?([^"']+)?["']?\s*["']?([^"']+)?["']?/;

CMS.registerEditorComponent({
  id: "imageTag",
  label: "ImageTag",
  // Fields the user need to fill out when adding an instance of the component
  fields: [
    { name: 'class', label: 'Class Names', widget: 'string', required: false },
    { name: 'path', label: 'Path', widget: 'file' },
    { name: 'title', label: 'Title', widget: 'string', required: false },
    { name: 'width', label: 'Width', widget: 'string', required: false },
    { name: 'height', label: 'Height', widget: 'string', required: false },
    { name: 'alt', label: 'Alt', widget: 'string', required: false }
  ],
  // Pattern to identify a block as being an instance of this component
  pattern: /^\{\% img .{0,}\%\}$/,
  // Function to extract data elements from the regexp match
  fromBlock: function (match) {
    //Get args
    let args = match[0].split(' ');
    args = args.filter((item) => item);
    args = args.slice(2,args.length - 1);

    const classes = [];
    let path;
  
    // Find image URL and class name
    while (args.length > 0) {
      const item = args.shift();
      if (rUrl.test(item) || item[0] === '/') {
        path = item;
        break;
      } else {
        classes.push(item);
      }
    }
  
    let width, height, title, alt;
  
    // Find image width and height
    if (args && args.length) {
      if (!/\D+/.test(args[0])) {
        width = args.shift();
  
        if (args.length && !/\D+/.test(args[0])) {
          height = args.shift();
        }
      }
  
      const match = rMeta.exec(args.join(' '));
  
      // Find image title and alt
      if (match != null) {
        title = match[1];
        alt = match[2];
      }
    }
  
    const attrs = {
      path,
      class: classes.join(' '),
      width,
      height,
      title,
      alt
    };
  
    return attrs;
  },
  // Function to create a text block from an instance of this component
  toBlock: function (obj) {
    let args = Object.assign({
      class:'',
      path:'',
      width:'',
      height:'',
      title:''
    },obj);
    args.titleAlt = args.alt?"\""+args.title+"'"+args.alt+"'"+"\"":"\""+args.title+"\"";
    return `{% img ${args.class} ${args.path} ${args.width} ${args.height} ${args.titleAlt} %}`;
  },
  // Preview output for this component. Can either be a string or a React component
  // (component gives better render performance)
  toPreview: function (obj) {
    let href = window.location.href.split('?')[0].split('#')[0];
    console.log(href);
    let root = href.substring(0,href.length-7);
    console.log(root);
    if (!obj.path) {
      return `Please choose image!!`;
    }
    let src = obj.path.indexOf('http')==0?obj.path:root+obj.path.replace(/\/{2,}/g, '/');
    return `<img src="${src}" width="${obj.width}" height="${obj.height}" title="${obj.title}" alt="${obj.alt}"/>`;
  }
});

