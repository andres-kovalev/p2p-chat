export function downloadFile(filename: string, mimetype: string, content: ArrayBuffer): void {
  const file = new Blob([content], { type: mimetype });

  const url = window.URL.createObjectURL(file);

  const link = document.createElement('A') as HTMLAnchorElement;
  link.download = filename;
  link.href = url;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
