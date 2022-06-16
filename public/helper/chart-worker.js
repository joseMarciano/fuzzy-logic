const defaultOptions = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
}

const tempSensor = document.getElementById('tempSensor').getContext('2d')
const pertinenceTempSensor = document.getElementById('pertinenceTempSensor').getContext('2d')

const distSensor = document.getElementById('distSensor').getContext('2d')
const pertinenceDistSensor = document.getElementById('pertinenceDistSensor').getContext('2d')

const motor = document.getElementById('motor').getContext('2d')
const pertinenceMotor = document.getElementById('pertinenceMotor').getContext('2d')


const lineChart = (ctx, title, color, data) => new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: title,
            data: [...data],
            backgroundColor: [color],
            borderColor: [color],
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour'
                }
            }
        }
    }
})

const lineMultiChart = (ctx, datas) => new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: datas.map((item) => ({
            label: item.label,
            data: [...item.data],
            backgroundColor: [item.color],
            borderColor: [item.color],
        }))
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour'
                }
            }
        }
    }
})


const tempSensorChart = lineChart(tempSensor, 'Temperature ·C',
    'rgba(255, 99, 132, 1)',
    []
)


const pertinenceTempSensorChart = lineMultiChart(
    pertinenceTempSensor,
    [{
        color: 'rgba(75, 192, 192, 0.2)',
        label: 'Cold',
        data: []
    },
    {
        color: 'rgba(153, 102, 255, 0.2)',
        label: 'Good',
        data: []
    },
    {
        color: 'rgba(255, 159, 64, 0.2)',
        label: 'Hot',
        data: []
    }]
)

const distSensorChart = lineChart(distSensor, 'Distance (cm)',
    'rgba(54, 162, 235, 1)',
    []
)

const pertinenceDistSensorChart = lineMultiChart(
    pertinenceDistSensor,
    [{
        color: 'rgba(75, 192, 192, 0.2)',
        label: 'Near',
        data: []
    },
    {
        color: 'rgba(153, 102, 255, 0.2)',
        label: 'Safe',
        data: []
    },
    {
        color: 'rgba(255, 159, 64, 0.2)',
        label: 'Distant',
        data: []
    }]
)


const motorChart = lineChart(motor, 'Motor (A)',
    'rgba(255, 206, 86, 1)',
    []
)

const motorPertinenceChart = lineMultiChart(
    pertinenceMotor,
    [{
        color: 'rgba(75, 192, 192, 0.2)',
        label: 'Minimum',
        data: []
    },
    {
        color: 'rgba(153, 102, 255, 0.2)',
        label: 'Average',
        data: []
    },
    {
        color: 'rgba(255, 159, 64, 0.2)',
        label: 'Maximum',
        data: []
    }]
)
