const convertedWrapper = document.querySelector("#converted");
const convertedBase64DataTextArea = document.querySelector("#convertedData");
const previewImg = document.querySelector("#previewImg");
const copyAllBtn = document.querySelector("#copyBtn");
const imageURL = document.querySelector("#url");
const fileEle = document.querySelector("#file");
const convertBtn = document.querySelector("#convertBtn");
const loading = document.querySelector("#loading");
const DATA = {
    base64: null,
};
document.addEventListener("paste", handlePaste);
fileEle.addEventListener("change", handleFileChange);
copyAllBtn.addEventListener("click", handleCopyAll);
imageURL.addEventListener("change", handleURLImage);
convertBtn.addEventListener("click", handleConvert);
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", handleDrop);
async function handleConvert() {
    handleShowBase64(DATA.base64);
}
async function handlePaste(e) {
    const clipboardData = e.clipboardData;
    const file = clipboardData.files[0];
    if (!file || !file.type.startsWith("image/"))
        return;
    handleLoading();
    const imageData = await getImageData(file);
    handlePreviewImg(imageData);
    handleShowBase64(imageData);
}
async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/"))
        return;
    handleLoading();
    if (imageURL.value)
        imageURL.value = "";
    const imageData = await getImageData(file);
    handlePreviewImg(imageData);
    DATA.base64 = imageData;
}
async function handleURLImage(e) {
    const url = e.target.value;
    if (!url)
        return;
    handleLoading();
    let blob;
    try {
        const response = await fetch(url);
        blob = await response.blob();
    }
    catch (error) {
        console.error(error);
        return alert("Error: " + error.message);
    }
    if (fileEle.value)
        fileEle.value = "";
    const imageData = await getImageData(blob);
    handlePreviewImg(imageData);
    DATA.base64 = imageData;
}
async function handleDrop(e) {
    e.preventDefault();
    handleLoading();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/"))
        return;
    if (imageURL.value)
        imageURL.value = "";
    if (fileEle.value)
        fileEle.value = file.name;
    const imageData = await getImageData(file);
    handlePreviewImg(imageData);
    DATA.base64 = imageData;
}
function handleCopyAll() {
    navigator.clipboard.writeText(convertedBase64DataTextArea.value);
}
function handlePreviewImg(imageData) {
    previewImg.style.display = "block";
    previewImg.src = imageData;
}
function handleShowBase64(imageData) {
    convertedWrapper.style.display = "block";
    convertedBase64DataTextArea.value = imageData;
}
function getImageData(file) {
    return new Promise((resolve) => {
        handleLoading();
        let reader = new FileReader();
        reader.addEventListener("load", function () {
            resolve(reader.result.toString());
        }, false);
        reader.readAsDataURL(file);
    });
}
function handleLoading() {
    loading.style.display = "block";
    DATA.base64 = null;
    let numberOfDots = 1;
    let interval = setInterval(() => {
        if (DATA.base64) {
            loading.style.display = "none";
            return clearInterval(interval);
        }
        if (numberOfDots === 3)
            numberOfDots = 1;
        else
            numberOfDots++;
        loading.innerText = loading.innerText =
            "Loading" + ".".repeat(numberOfDots);
    }, 1);
}
