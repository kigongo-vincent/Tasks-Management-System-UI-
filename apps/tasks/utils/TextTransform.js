export function transformText(text) {
  if (text?.length !== 0) {
    const urlRegex = /(https?:\/\/[^\s]+)/g; // Regular expression to match URLs
    const bulletRegex = /(^|\s)([-\*\+]|\d+\.)\s+/g; // Regex to match bullets or numbered lists

    // Step 1: Transform URLs into anchor tags
    const transformedText = text
      .toString()
      .split(urlRegex)
      .map((part, index) =>
        urlRegex.test(part)
          ? `<a href="${part}" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">${part}</a><br/>`
          : part
      )
      .join("");

    // Step 2: Insert a line break for each bullet or numbered list
    const finalText = transformedText.replace(bulletRegex, (match, p1, p2) => {
      // We return an empty string before each bullet and insert <br /> to break the line
      return `<br />${p1}${p2} `;
    });

    return finalText;
  }
}
