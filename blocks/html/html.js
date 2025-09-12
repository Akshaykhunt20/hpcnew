export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // Process HTML content to remove comments but keep their content
      const processComments = (element) => {
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_COMMENT,
          null,
          false,
        );

        const commentsToReplace = [];
        let comment;

        // Collect all comments
        /* eslint-disable no-cond-assign */
        while (comment = walker.nextNode()) {
          commentsToReplace.push(comment);
        }
        /* eslint-enable no-cond-assign */

        // Replace comments with their content
        commentsToReplace.forEach((commentNode) => {
          const content = commentNode.nodeValue.trim();
          if (content.startsWith('<div')) {
            // Create a temporary container
            const temp = document.createElement('div');
            temp.innerHTML = content;
            // Replace comment with the parsed content
            commentNode.parentNode.replaceChild(temp.firstChild, commentNode);
          }
        });
      };
      processComments(col);
    });
  });
}
