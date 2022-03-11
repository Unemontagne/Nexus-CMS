var { NxData, CMS } = window
if (!NxData.site) {
  NxData.site = window.location.href.split('/admin')[0]
  NxData.instances.deflt = NxData.site + '/' + NxData.instances.deflt
}

/* previews */

/* https://www.npmjs.com/package/htm */
var n = function (t, s, r, e) {
    var u
    s[0] = 0
    for (var h = 1; h < s.length; h++) {
      var p = s[h++],
        a = s[h] ? ((s[0] |= p ? 1 : 2), r[s[h++]]) : s[++h]
      3 === p
        ? (e[0] = a)
        : 4 === p
        ? (e[1] = Object.assign(e[1] || {}, a))
        : 5 === p
        ? ((e[1] = e[1] || {})[s[++h]] = a)
        : 6 === p
        ? (e[1][s[++h]] += a + '')
        : p
        ? ((u = t.apply(a, n(t, a, r, ['', null]))),
          e.push(u),
          a[0] ? (s[0] |= 2) : ((s[h - 2] = 0), (s[h] = u)))
        : e.push(a)
    }
    return e
  },
  t = new Map()
const htm = function (s) {
  var r = t.get(this)
  return (
    r || ((r = new Map()), t.set(this, r)),
    (r = n(
      this,
      r.get(s) ||
        (r.set(
          s,
          (r = (function (n) {
            for (
              var t,
                s,
                r = 1,
                e = '',
                u = '',
                h = [0],
                p = function (n) {
                  1 === r && (n || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, '')))
                    ? h.push(0, n, e)
                    : 3 === r && (n || e)
                    ? (h.push(3, n, e), (r = 2))
                    : 2 === r && '...' === e && n
                    ? h.push(4, n, 0)
                    : 2 === r && e && !n
                    ? h.push(5, 0, !0, e)
                    : r >= 5 &&
                      ((e || (!n && 5 === r)) && (h.push(r, 0, e, s), (r = 6)),
                      n && (h.push(r, n, 0, s), (r = 6))),
                    (e = '')
                },
                a = 0;
              a < n.length;
              a++
            ) {
              a && (1 === r && p(), p(a))
              for (var l = 0; l < n[a].length; l++)
                (t = n[a][l]),
                  1 === r
                    ? '<' === t
                      ? (p(), (h = [h]), (r = 3))
                      : (e += t)
                    : 4 === r
                    ? '--' === e && '>' === t
                      ? ((r = 1), (e = ''))
                      : (e = t + e[0])
                    : u
                    ? t === u
                      ? (u = '')
                      : (e += t)
                    : '"' === t || "'" === t
                    ? (u = t)
                    : '>' === t
                    ? (p(), (r = 1))
                    : r &&
                      ('=' === t
                        ? ((r = 5), (s = e), (e = ''))
                        : '/' === t && (r < 5 || '>' === n[a][l + 1])
                        ? (p(), 3 === r && (h = h[0]), (r = h), (h = h[0]).push(2, 0, r), (r = 0))
                        : ' ' === t || '\t' === t || '\n' === t || '\r' === t
                        ? (p(), (r = 2))
                        : (e += t)),
                  3 === r && '!--' === e && ((r = 4), (h = h[0]))
            }
            return p(), h
          })(s))
        ),
        r),
      arguments,
      []
    )).length > 1
      ? r
      : r[0]
  )
}
const html = htm.bind(h)
const changeEvt = new CustomEvent('change')
const parser = new DOMParser()
const mdWidget = CMS.getWidget('markdown')

function linkElm(props, href) {
  var link = props.document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = href
  props.document.head.appendChild(link)
  return link
}

function scriptElm(props, src) {
  var sc = props.document.createElement('script')
  sc.src = src
  props.document.head.appendChild(sc)
  return sc
}
function removeLastTheme(props) {
  var lastTheme = props.document.head.querySelector('link')
  if (lastTheme) {
    lastTheme.remove()
  }
}

function removeScript(props) {
  var prevsc = props.document.head.querySelector('script')
  if (prevsc) {
    prevsc.remove()
  }
}

function defaultNx(props) {
  var nx = props.document.createElement('div')
  nx.id = 'Nexus'
  nx.dataset.src = NxData.instances.deflt
  nx.dataset.lang = NxData.instances.lang
  nx.dataset.style = NxData.instances.style
  return nx
}

function fetchPage(path) {
  return fetch(path)
    .then(function (response) {
      return response.text()
    })
    .then(function (html) {
      var doc = parser.parseFromString(html, 'text/html')
      return doc.body.querySelector('main')
    })
    .catch(function () {
      return "Page is not responding. If you've just created it, wait a few seconds, then toggle preview pane."
    })
}

const InstancesPreview = createClass({
  componentDidMount() {
    scriptElm(this.props, NxData.instances.script)
  },
  componentDidUpdate() {
    this.nxelm.dispatchEvent(changeEvt)
  },
  render: function () {
    var filename = this.props.entry.getIn(['data', 'meta_filename'], null)
    if (!filename) {
      filename = '???'
    }
    this.htmlsrc = NxData.site + '/nexus/' + filename
    this.src = NxData.site + '/source/' + filename + '.json'

    var author = {}
    var authfields = ['handle', 'about', 'url']
    authfields.forEach((f) => {
      var av = this.props.entry.getIn(['data', 'author', f], null)
      if (av === null) {
        av = ''
        if (f === 'handle') {
          av = 'author-handle'
        } else if (f === 'url') {
          av = 'http://website.xyz'
        }
      }
      author[f] = av
    })
    var threads = []
    var map = {
      thread: ['id', 'title', 'description'],
      content: ['timestamp', 'main', 'aside'],
      content_media: ['url', 'type', 'caption'],
    }
    var tdata = this.props.entry.getIn(['data', 'threads'], null)
    if (tdata) {
      for (var i = 0; i < tdata.size; i++) {
        var th = { content: { media: {} } }
        for (let [k, fields] of Object.entries(map)) {
          fields.forEach((f) => {
            if (k === 'thread') {
              var tv = this.props.entry.getIn(['data', 'threads', i, f], null)
              if (tv === null) {
                tv = ''
                if (i === 0) {
                  if (f === 'id') {
                    tv = 'th-' + i + 1
                  } else if (f === 'title') {
                    tv = '???'
                  }
                }
              }
              th[f] = tv
            } else {
              var tvc = this.props.entry.getIn(['data', 'threads', i, k + '_' + f], null)
              if (tvc === null) {
                tvc = ''
                if (i === 0 && f === 'main') {
                  tvc = '...'
                }
              }
              if (k === 'content') {
                th.content[f] = tvc
              } else {
                if (tvc.length && f === 'url') {
                  tvc = NxData.site + tvc
                }
                th.content.media[f] = tvc
              }
            }
          })
        }
        th.linked = []
        var linked = this.props.entry.getIn(['data', 'threads', i, 'linked'], null)
        if (linked) {
          for (var j = 0; j < linked.size; j++) {
            var lkUrl = this.props.entry.getIn(['data', 'threads', i, 'linked', j, 'url'], null)
            if (lkUrl) {
              th.linked.push(lkUrl)
            }
          }
        }

        threads.push(th)
      }
    } else {
      threads.push({
        id: 'th-1',
        title: '???',
        content: {
          timestamp: new Date().toString(),
          main: '...',
        },
      })
    }
    this.srcdoc = JSON.stringify({
      nexus: 'https://nexus-dock.github.io/',
      author: author,
      threads: threads,
    })

    return html`<p class="nx-slug">${this.htmlsrc}</p>
      <div id="preview">
        <div
          id="Nexus"
          ref=${(el) => (this.nxelm = el)}
          data-src=""
          data-srcdoc=${this.srcdoc}
          data-lang=${NxData.instances.lang}
          data-style=${NxData.instances.style}
        ></div>
      </div>`
  },
})

const InstancesSettPreview = createClass({
  componentDidUpdate() {
    this.nxelm.textContent = ''

    removeScript(this.props)
    removeLastTheme(this.props)
    this.nxelm.dataset.lang = this.props.entry.getIn(['data', 'default_lang'], null)
    this.nxelm.dataset.style = this.props.entry.getIn(['data', 'custom_theme_url'], null)
    var inst = this.props.entry.getIn(['data', 'default_instance'], null)
    var src = NxData.site + '/source/' + inst + '.json'
    var instsrc = this.props.fieldsMetaData.getIn(['default_instance', 'instances', inst]).toJS()
    if (
      this.props.entry.getIn(['data', 'load_first_thread'], null) &&
      instsrc.threads.length &&
      instsrc.threads[0].id
    ) {
      src += '#' + instsrc.threads[0].id
    }
    var srcdoc = ''
    if (src !== this.nxelm.dataset.src) {
      var threads = []
      for (var i = 0; i < instsrc.threads.length; i++) {
        threads.push({
          id: instsrc.threads[i].id,
          title: instsrc.threads[i].title,
          description: instsrc.threads[i].description ? instsrc.threads[i].description : '',
          content: {
            timestamp: instsrc.threads[i].content_timestamp,
            main: instsrc.threads[i].content_main,
            aside: instsrc.threads[i].content_aside ? instsrc.threads[i].content_aside : '',
            media: {
              url: instsrc.threads[i].content_media_url ? instsrc.threads[i].content_media_url : '',
              type: instsrc.threads[i].content_media_type
                ? instsrc.threads[i].content_media_type
                : 'page',
              caption: instsrc.threads[i].content_media_caption
                ? instsrc.threads[i].content_media_caption
                : '',
            },
          },
          linked: instsrc.threads[i].linked ? instsrc.threads[i].linked.map((l) => l.url) : [],
        })
      }
      srcdoc = JSON.stringify({
        nexus: 'https://nexus-dock.github.io/',
        author: instsrc.author,
        threads: threads,
      })
    }
    this.nxelm.dataset.src = src
    this.nxelm.dataset.srcdoc = srcdoc

    scriptElm(this.props, this.props.entry.getIn(['data', 'script_url'], null))
  },
  componentDidMount() {
    this.nxelm = defaultNx(this.props)
    this.indexPagePrev.append(this.nxelm)
    scriptElm(this.props, NxData.instances.script)
  },
  render: function () {
    return html`<p class="nx-slug">${NxData.site}/nexus</p>
      <div id="preview" ref=${(el) => (this.indexPagePrev = el)}></div>`
  },
})

const PagesSettPreview = createClass({
  resolveTheme() {
    var cst = this.props.entry.getIn(['data', 'custom_theme_url'], null)
    if (cst) {
      return cst
    }
    return NxData.site + '/assets/css/NxPages.css'
  },
  componentDidUpdate() {
    var theme = this.resolveTheme()
    if (theme !== this.styleLink.href) {
      this.styleLink.href = theme
    }
  },
  componentDidMount() {
    this.styleLink = linkElm(this.props, this.resolveTheme())
  },
  render: function () {
    var prevwProps = {
      value: null,
    }
    var deflt = this.props.entry.getIn(['data', 'default_page'], null)
    if (deflt) {
      var content = this.props.fieldsMetaData.getIn(['default_page', 'pages', deflt, 'content'])
      if (content) {
        prevwProps.value = content
      }
    }
    var mdPrevw = new mdWidget.preview(prevwProps)
    var mdRender = mdPrevw.render()
    return html`<p class="nx-slug">${NxData.site}/pages</p>
      <div id="preview"><main>${mdRender}</main></div>`
  },
})

const PagesPreview = createClass({
  componentDidMount() {
    linkElm(this.props, NxData.pages.style)
  },
  render: function () {
    var filename = this.props.entry.getIn(['data', 'meta_filename'], null)
    if (!filename) {
      filename = '???'
    }
    this.htmlsrc = NxData.site + '/pages/' + filename

    return html`<p class="nx-slug">${this.htmlsrc}</p>
      <div id="preview"><main>${this.props.widgetFor('content')}</main></div>`
  },
})

const SiteSettPreview = createClass({
  componentDidUpdate(prevProps) {
    var frontpage = this.props.entry.getIn(['data', 'front_page'], null)
    if (frontpage !== prevProps.entry.getIn(['data', 'front_page'], null)) {
      this.indexPagePrev.textContent = ''

      if (frontpage === 'default Nexus instance') {
        if (this.lkElm) {
          this.lkElm.remove()
        }
        this.indexPagePrev.append(this.dfltNx)
        this.scElm = scriptElm(this.props, NxData.instances.script)
      } else {
        if (this.scElm) {
          this.scElm.remove()
        }
        this.lkElm = linkElm(this.props, NxData.pages.style)
        fetchPage(NxData.pages.deflt + '/index.html').then((content) => {
          this.indexPagePrev.append(content)
        })
      }
    }
  },
  componentDidMount() {
    this.dfltNx = defaultNx(this.props)

    if (this.props.entry.getIn(['data', 'front_page'], null) === 'default Nexus instance') {
      this.indexPagePrev.append(this.dfltNx)
      this.scElm = scriptElm(this.props, NxData.instances.script)
    } else {
      this.lkElm = linkElm(this.props, NxData.pages.style)
      fetchPage(NxData.pages.deflt + '/index.html').then((content) => {
        this.indexPagePrev.append(content)
      })
    }
  },
  render: function () {
    var url = this.props.entry.getIn(['data', 'url'], null)
    return html`<p class="nx-slug">${url}/</p>
      <div ref=${(el) => (this.indexPagePrev = el)} id="preview"></div>`
  },
})

CMS.registerPreviewTemplate('_site', SiteSettPreview)
CMS.registerPreviewTemplate('_instances', InstancesSettPreview)
CMS.registerPreviewTemplate('_pages', PagesSettPreview)
CMS.registerPreviewTemplate('instances', InstancesPreview)
CMS.registerPreviewTemplate('pages', PagesPreview)

/* widgets */

const StrWidget = CMS.getWidget('string')

class NxUniqueFilename extends StrWidget.control {
  componentDidMount() {
    this.category = this.props.field.get('category')
    this.initialValue = this.props.value
  }
  isValid = () => {
    var err
    if (!/^[a-zA-Z0-9_-]{1,36}$/.test(this.props.value)) {
      err = 'Invalid file name'
    } else if (
      this.props.value !== this.initialValue &&
      NxData[this.category].list.includes(this.props.value)
    ) {
      err = 'This file already exists'
    }
    if (err) {
      return { error: { message: err } }
    }
    return true
  }
}

var threadStore = []
class NxUniqueThreadCtrl extends StrWidget.control {
  componentDidMount() {
    this.index = threadStore.length
    threadStore.push(this.props.value)
  }
  isValid = () => {
    var err
    if (!/^[a-zA-Z0-9-]{3,36}$/.test(this.props.value)) {
      err = 'Invalid thread id'
    } else if (
      this.props.value !== threadStore[this.index] &&
      threadStore.includes(this.props.value)
    ) {
      err = 'Thread id already exists'
    }
    if (err) {
      return { error: { message: err } }
    }
    threadStore[this.index] = this.props.value
    return true
  }
}

const InfoControl = createClass({
  render: function () {
    const text = this.props.field.get('text')
    var p = h('span', {}, text)
    const url = this.props.field.get('url')
    var link
    if (url) {
      var displayUrl = url.replace(/https?:\/\//, '')
      link = h(
        'a',
        {
          href: url,
          target: '_blank',
        },
        displayUrl
      )
    }
    return h(
      'div',
      {
        id: this.props.forID,
      },
      [p, link]
    )
  },
})

CMS.registerWidget('nx-unique-filename', NxUniqueFilename, StrWidget.preview)
CMS.registerWidget('nx-unique-thread', NxUniqueThreadCtrl, StrWidget.preview)
CMS.registerWidget('info', InfoControl)

/* md widgets */
const mdCollectionMap = [
  {
    id: 'nexus-instance-link',
    label: 'Nexus Instance Link',
    field: 'Nexus',
    collection: 'instances',
    folder: 'nexus',
  },
  {
    id: 'markdown-pages-link',
    label: 'Markdown Page Link',
    field: 'Page',
    collection: 'pages',
    folder: 'pages',
  },
]

function resolveLinkDisplay(data) {
  if (data.display) {
    return data.display
  }
  if (data.link) {
    return data.link
  }
  return '?'
}

function renderList(data) {
  var list = ''
  if (data.collection) {
    var folder = 'nexus'
    var key = 'instances'
    if (data.collection === 'Nexus instances') {
      key = 'pages'
      folder = 'pages'
    }
    var items = NxData[key].list
    items.forEach((item) => {
      list += `- [${item}](/'${folder}/${item})\n`
    })
  }
  return list
}

function renderBlock(data, c) {
  return `[${resolveLinkDisplay(data)}](/${c.folder}/${data.link})`
}

mdCollectionMap.forEach((c) => {
  CMS.registerEditorComponent({
    id: c.id,
    label: c.label,
    fields: [
      {
        name: 'link',
        label: c.field,
        widget: 'relation',
        required: true,
        collection: c.collection,
        search_fields: ['meta_filename'],
        value_field: 'meta_filename',
      },
      {
        name: 'display',
        label: 'Display Text',
        required: false,
        widget: 'string',
      },
    ],
    pattern: new RegExp('^[.*]$^(/' + c.folder + '/.*)$', 'ms'),
    fromBlock: function (match) {
      return {
        display: match[1],
        link: match[2],
      }
    },
    toBlock: function (data) {
      return renderBlock(data, c)
    },
    toPreview: function (data) {
      return renderBlock(data, c)
    },
  })
})
CMS.registerEditorComponent({
  id: 'collection-index',
  label: 'Collection Index',
  fields: [
    {
      name: 'collection',
      label: 'Collection',
      widget: 'select',
      required: true,
      multiple: false,
      options: ['Nexus instances', 'Markdown pages'],
    },
  ],
  pattern: /^<ul>.*<\/ul>$/ms,
  fromBlock: function (match) {
    return {
      collection: match[1],
    }
  },
  toBlock: function (data) {
    return renderList(data)
  },
  toPreview: function (data) {
    return renderList(data)
  },
})

/* style */
const addressCss = `.nx-slug { 
  width: calc(100% - 30px);
  background: #f5f5f5;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  padding: 10px;
  line-height: 1em;
  color: rgb(122 130 145);
  border-bottom: 2px solid rgb(223 223 227);
  position: absolute;
  left: 0;
  top: 0;
  }
  div#preview {
    padding-top:48px;
}`
CMS.registerPreviewStyle(addressCss, { raw: true })
