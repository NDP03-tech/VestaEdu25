import parse, { domToReact } from 'html-react-parser';

export function renderClozeHTMLWithDropdowns({ html, dropdowns = [], userAnswers = {}, onChange }) {
  return parse(html, {
    replace: (domNode) => {
      if (
        domNode.name === 'a' &&
        domNode.attribs &&
        domNode.attribs.class?.includes('cloze') &&
        domNode.attribs.class?.includes('dropdown')
      ) {
        const answer = domNode.attribs['data-answer'];
        const optionsRaw = domNode.attribs['data-options'];
        let options = [];
        try {
          options = JSON.parse(optionsRaw);
        } catch (e) {
          options = [answer];
        }

        const dropdownId = answer + domNode.startIndex; // tạo id tạm thời
        const selected = userAnswers?.[dropdownId] || "";

        return (
          <select
            value={selected}
            onChange={(e) => onChange?.(dropdownId, e.target.value)}
            className="dropdown-select"
          >
            <option value="">[select]</option>
            {options.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );
      }
    }
  });
}
