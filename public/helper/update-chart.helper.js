var socket = io()
socket.on('data', (msg) => {
    updateTempSensorChart(msg.temperatureSensor)
    updateDistSensorChart(msg.distanceSensor)
    updateMotorChart(msg.motorInversor)


    updatePertinenceChart(pertinenceTempSensorChart, msg.temperatureSensor)
    updatePertinenceChart(pertinenceDistSensorChart, msg.distanceSensor)
    updatePertinenceChart(motorPertinenceChart, msg.motorInversor)
})

function updateTempSensorChart(param) {
    tempSensorChart.data.datasets.forEach((dataset) => {
        dataset.data.push({
            x: moment().format('YYYY-MM-DD hh:mm:ss'), //'2021-11-10 01:00:28',
            y: param.Temp
        })
    })

    tempSensorChart.update();
}

function updatePertinenceTempSensorChart(param) {

    pertinenceTempSensorChart.data.datasets.forEach((dataset) => {
        dataset.data.push({
            y: param[dataset.label],
            x: moment().format('YYYY-MM-DD hh:mm:ss')
        });
    })

    pertinenceTempSensorChart.update();

}

function updateDistSensorChart(param) {
    distSensorChart.data.datasets.forEach((dataset) => {
        dataset.data.push({
            x: moment().format('YYYY-MM-DD hh:mm:ss'), //'2021-11-10 01:00:28',
            y: param.Dist
        })
    })

    distSensorChart.update();
}

function updatePertinanceDistSensorChart(param) {
    pertinenceDistSensorChart.data.datasets.forEach((dataset) => {
        dataset.data.push({
            y: param[dataset.label],
            x: moment().format('YYYY-MM-DD hh:mm:ss')
        });
    })

    pertinenceDistSensorChart.update();

}

function updateMotorChart(param) {
    motorChart.data.datasets.forEach((dataset) => {
        dataset.data.push({
            x: moment().format('YYYY-MM-DD hh:mm:ss'), //'2021-11-10 01:00:28',
            y: param.Output
        })
    })

    motorChart.update();
}

function updatePetinenceMotorChart(param) {
    motorPertinenceChart.data.datasets.forEach((dataset) => {
        dataset.data.push({
            x: moment().format('YYYY-MM-DD hh:mm:ss'), //'2021-11-10 01:00:28',
            y: param[dataset.label]
        })
    })

    motorPertinenceChart.update();
}


function updatePertinenceChart(chart, param) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push({
            x: moment().format('YYYY-MM-DD hh:mm:ss'), //'2021-11-10 01:00:28',
            y: (param[dataset.label] || 0) * 100
        })
    })

    chart.update();
}