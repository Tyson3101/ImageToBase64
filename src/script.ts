const convertedWrapper = document.querySelector("#converted") as HTMLDivElement;
const convertedBase64DataTextArea = document.querySelector(
  "#convertedData"
) as HTMLTextAreaElement;
const previewImg = document.querySelector("#previewImg") as HTMLImageElement;
const copyAllBtn = document.querySelector("#copyBtn") as HTMLButtonElement;
const imageURL = document.querySelector("#url") as HTMLInputElement;
const file = document.querySelector("#file") as HTMLInputElement;
const convertBtn = document.querySelector("#convertBtn") as HTMLButtonElement;

const DATA: { base64: string } = {
  base64: null,
};

document.addEventListener("paste", handlePaste);
file.addEventListener("change", handleFileChange);
copyAllBtn.addEventListener("click", handleCopyAll);
imageURL.addEventListener("change", handleURLImage);
convertBtn.addEventListener("click", handleConvert);

async function handleConvert() {
  handleShowBase64(DATA.base64);
}

async function handlePaste(e: ClipboardEvent) {
  const clipboardData = e.clipboardData;
  const file = clipboardData.files[0];
  if (!file || !file.type.startsWith("image/")) return;
  const imageData = await getImageData(file);
  handlePreviewImg(imageData);
  handleShowBase64(imageData);
}

async function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files[0];
  if (!file || !file.type.startsWith("image/")) return;
  if (imageURL.value) imageURL.value = "";
  const imageData = await getImageData(file);
  handlePreviewImg(imageData);
  DATA.base64 = imageData;
}

async function handleURLImage(e: Event) {
  const url = (e.target as HTMLInputElement).value;
  if (!url) return;
  let blob: Blob;
  try {
    const response = await fetch(url);
    blob = await response.blob();
  } catch (error) {
    console.error(error);
    return alert("Error: " + error.message);
  }
  if (file.value) file.value = "";
  const imageData = await getImageData(blob);
  handlePreviewImg(imageData);
  DATA.base64 = imageData;
}

function handleCopyAll() {
  navigator.clipboard.writeText(convertedBase64DataTextArea.value);
}

function handlePreviewImg(imageData: string) {
  previewImg.style.display = "block";
  previewImg.src = imageData;
}

function handleShowBase64(imageData: string) {
  convertedWrapper.style.display = "block";
  convertedBase64DataTextArea.value = imageData;
}

function getImageData(file: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        resolve(reader.result.toString());
      },
      false
    );
    reader.readAsDataURL(file);
  });
}
