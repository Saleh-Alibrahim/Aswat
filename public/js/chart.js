const colorsList = ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"];

const dynamicColors = (i) => {
    if (i < colorsList.length) {
        return colorsList[i];
    }
    else {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    }
};
let labels = [];
let counts = [];
let colors = [];
const options_labels = document.getElementsByClassName('option-name');
const options_count = document.getElementsByClassName('vote-count');
for (let i = 0; i < options_labels.length; i++) {
    labels.push(options_labels[i].innerHTML);
    counts.push(options_count[i].innerHTML);
    colors.push(dynamicColors(i));
}
new Chart(document.getElementById("pie-chart"), {
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            backgroundColor: colors,
            data: counts
        }]
    },
    options: {
    }
});