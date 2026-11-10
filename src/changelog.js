/**
 * Render the local, project-owned CHANGELOG.md with a deliberately limited
 * Markdown dialect. No external libraries and no raw HTML interpretation.
 */
export function changelogToHtml(markdown) {
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const format = value => escape(value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const blocks = [];
  let list = false;
  let release = false;
  const closeList = () => { if (list) { blocks.push('</ul>'); list = false; } };
  const closeRelease = () => { if (release) { closeList(); blocks.push('</section>'); release = false; } };
  for (const raw of String(markdown || '').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line === '# Changelog') continue;
    if (line.startsWith('## ')) {
      closeRelease();
      blocks.push('<section class="release-card"><h2>' + format(line.slice(3)) + '</h2>');
      release = true;
    } else if (line.startsWith('### ')) {
      closeList();
      blocks.push('<h3>' + format(line.slice(4)) + '</h3>');
    } else if (line.startsWith('- ')) {
      if (!list) { blocks.push('<ul>'); list = true; }
      blocks.push('<li>' + format(line.slice(2)) + '</li>');
    } else {
      closeList();
      blocks.push('<p>' + format(line) + '</p>');
    }
  }
  closeRelease();
  return blocks.join('');
}
