const domain = 'https://www.bing.com';
const apiDomain = 'https://qinshixixing-bing-image.herokuapp.com';

const box = document.getElementsByTagName('main')[0];
const operation = document.getElementById('operation');
const getImageBtn = operation.querySelector('button:first-child');
const downloadBtn = operation.querySelector('button:last-child');

let image, name;

const getInfo = async () => {
    const res = await fetch(apiDomain, {
        mode: 'cors'
    });
    let data;
    if (res.ok) data = await res.json();
    return data;
};

const getImage = async (url) => {
    url = `${domain}${url}`;
    const res = await fetch(url, {
        mode: 'cors'
    });
    let image;
    if (res.ok) image = await res.blob();
    return image;
};

const showImage = (blob) => {
    let img = document.getElementById('img');
    if (!img) {
        img = document.createElement('img');
        img.id = 'img';
        box.insertBefore(img, operation);
    }
    const reader = new FileReader();
    reader.onload = () => {
        img.src = reader.result;
    };
    reader.readAsDataURL(blob);
};

const setDownload = (name, blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
};

const getData = async () => {
    // if (image && name) return;
    getImageBtn.disabled = true;
    const data = await getInfo();
    image = await getImage(data.url);
    getImageBtn.disabled = false;
    name = data.name;
    showImage(image);
};

const download = () => {
    const url = URL.createObjectURL(image);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
};

getImageBtn.addEventListener('click', getData);
downloadBtn.addEventListener('click', download);
