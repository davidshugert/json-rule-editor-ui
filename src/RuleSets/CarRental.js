import { nanoid } from "nanoid";

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomIp() {
  return (
    Math.floor(Math.random() * 255) +
    1 +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255)
  );
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":")
  );
}

export default {
	"name": "Car",
	"attributes": [
		{
			"name": "DrivesPerWeek",
			"type": "number"
		},
		{
			"name": "AverageRating",
			"type": "number"
		},
		{
			"name": "State",
			"type": "string"
		},
		{
			"name": "AccountAge",
			"type": "number"
		}
	],
	"decisions": [
    {
			"conditions": {
				"all": [
					{
						"fact": "DrivesPerWeek",
						"operator": "greaterThanInclusive",
						"value": 5
					}
				]
			},
			"event": {
				"type": "Weekly-Trip-Goal",
				"params": {
					"weeklyGoal": "true"
				}
			}
		},
		{
			"conditions": {
				"all": [
					{
						"fact": "AverageRating",
						"operator": "greaterThanInclusive",
						"value": 3
					},
					{
						"fact": "AverageRating",
						"operator": "notEqual",
						"value": 5
					}
				]
			},
			"event": {
				"type": "satisfying-rating",
				"params": {
          "satisfyingRating": "true"
        }
			}
		},
		{
			"conditions": {
				"all": [
					{
						"fact": "DrivesPerWeek",
						"operator": "greaterThanInclusive",
						"value": 15
					},
					{
						"fact": "AverageRating",
						"operator": "greaterThanInclusive",
						"value": 3
					},
					{
						"fact": "AccountAge",
						"operator": "lessThan",
						"value": 1
					},
					{
						"any": [
							{
								"fact": "State",
								"operator": "equal",
								"value": "New York"
							},
							{
								"fact": "State",
								"operator": "equal",
								"value": "New Jersey"
							}
						]
					}
				]
			},
			"event": {
				"type": "Weekly-Cash-Bonus",
				"params": {}
			}
		},
		{
			"conditions": {
				"all": [
					{
						"fact": "AverageRating",
						"operator": "greaterThanInclusive",
						"value": 4.5
					}
				]
			},
			"event": {
				"type": "high-rating-award",
				"params": {}
			}
		}
	],
  "table":[
    {title:"Transactions Table",
    metadata: "Driver Id: 1 Driver Since: 2016 Driver State: New York",
    columns: [
      {
        name: "Driver Id",
        selector: (row) => row.driverId,
      },
      {
        name: "Timestamp",
        selector: (row) => row.timestamp,
        width: "200px",
      },
      {
        name: "Trip Id",
        selector: (row) => row.id,
        width: "100px",
      },
      {
        name: "Rating",
        selector: (row) => row.rating,
      },
      {
        name: "Trip Price",
        selector: (row) => row.price,
      },
      {
        name: "Coordinates",
        selector: (row) => row.coordinates,
        width: "180px",
      },
      {
        name: "IP",
        selector: (row) => row.ip,
        width: "150px",
      },
    ],
    data: [
      {
        timestamp: formatDate(
          randomDate(new Date(2022, 0, 1), new Date(2022, 6, 30))
        ),
        id: nanoid(10),
        rating: "4.5",
        price: formatter.format(26.99),
        coordinates: "40.7128°, 74.0060°",
        ip: randomIp(),
        driverId: 1,
      },
      {
        timestamp: formatDate(
          randomDate(new Date(2022, 0, 1), new Date(2022, 6, 30))
        ),
        id: nanoid(10),
        rating: "3.2",
        price: formatter.format(7.67),
        coordinates: "40.9641°, 75.9680°",
        ip: randomIp(),
        driverId: 1,
      },
      {
        timestamp: formatDate(
          randomDate(new Date(2022, 0, 1), new Date(2022, 6, 30))
        ),
        id: nanoid(10),
        rating: "4.5",
        price: formatter.format(26.99),
        coordinates: "42.9562°, 74.2364°",
        ip: randomIp(),
        driverId: 1,
      },
      {
        timestamp: formatDate(
          randomDate(new Date(2022, 0, 1), new Date(2022, 6, 30))
        ),
        id: nanoid(10),
        rating: "5",
        price: formatter.format(19.99),
        coordinates: "43.8312°, 74.9451°",
        ip: randomIp(),
        driverId: 1,
      },
      {
        timestamp: formatDate(
          randomDate(new Date(2022, 0, 1), new Date(2022, 6, 30))
        ),
        id: nanoid(10),
        rating: "4.9",
        price: formatter.format(18.00),
        coordinates: "43.9812°, 74.2151°",
        ip: randomIp(),
        driverId: 1,
      },
    ],
    generateFacts: (data) => {
      const ratings = data.map((d) => Number(d.rating));
      const avgRating = ratings.reduce((acc, c) => acc + c, 0) / ratings.length;
    
      return {
        DrivesPerWeek: data.length,
        AverageRating: avgRating,
        State: "New York",
        AccountAge: 7,
      };
    }
  }
  ]
}