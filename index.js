const domain = 'https://www.bing.com';

const api = {
    main: 'https://1385629885875963.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/qinshixixing/bing-image/',
    HK: 'https://1385629885875963.cn-hongkong.fc.aliyuncs.com/2016-08-15/proxy/qinshixixing/bing-image/',
    US: 'https://qinshixixing-bing-image.herokuapp.com'
};

const box = document.getElementsByTagName('main')[0];
const operation = document.getElementById('operation');
const btns = Array.prototype.slice.call(operation.querySelectorAll('button')).filter(btn => btn.dataset.tag !== 'download');
let image, name;

const getInfo = async (type) => {
    let apiDomain = api[type];
    if (!apiDomain) apiDomain = api.main;
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

const getData = async (type) => {
    // if (image && name) return;
    btns.forEach(btn => {
        btn.disabled = true;
    });
    const data = await getInfo(type);
    image = await getImage(data.url);
    btns.forEach(btn => {
        btn.disabled = false;
    });
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

operation.addEventListener('click', (evt) => {
    const target = evt.target;
    if (target.tagName.toLowerCase() !== 'button') return;
    const type = target.dataset.tag;
    if (type === 'download') download();
    else getData(type);
});
