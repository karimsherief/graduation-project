var model;

const label = {
    0: "Benign",
    1: "Malignent"
};

(async () => {
    model = await tf.loadLayersModel('/model/model.json');
    console.log('model loaded');
})();


// Global 

const uploadBtn = document.querySelector("#upload-btn");

uploadBtn.onclick = () => {
    document.getElementById('getFile').click()
};

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#output')
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}
const reset = () => {
    document.getElementById('prediction').src = "/images/download.png";
    document.getElementById('output').src = "/images/download.png"
}

// Patient GUI


$('.tab a').on('click', function (e) {

    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.tab-content > div').not(target).hide();
    $(target).fadeIn(600);

});

$("input[name=result]").keydown(function (e) {
    e.preventDefault();
});
// Prediction  

// Patient prediction
PGUI = () => {
    predict()
        .then(value => document.querySelector("input[name=result]").value = value)

    document.querySelector('.result').click();
}

// Doctor prediction
GUI = () => {
    const td2 = document.createElement('td');
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');

    td1.innerHTML = `<i class=" fa-solid fa-check"></i>`;
    predict()
        .then(value => td2.innerHTML = value);
    tr.append(td1);
    tr.append(td2);

    document.querySelector('table tbody').append(tr);

}


predict = async () => {
    // action for the submit button

    let image = document.getElementById("output")
    let tensorImg = tf.browser.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat().expandDims(0);

    prediction = await model.predict(tensorImg).data();
    document.getElementById('prediction').src = image.src;

    return label[Math.round(prediction[1])]

}
