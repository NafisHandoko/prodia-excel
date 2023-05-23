import './App.css';
import {
	CellModel,
	RangeDirective, RangesDirective, SheetDirective, SheetModel, SheetsDirective,
	SpreadsheetComponent,
	getCell
} from '@syncfusion/ej2-react-spreadsheet';
import { Spreadsheet } from '@syncfusion/ej2-react-spreadsheet';
import { ChangeEvent, useEffect, useState } from 'react';

function App() {
	const [sheetFile, setSheetFile] = useState<File | null>(null)
	const [fetchedJson, setFetchedJson] = useState(null)
	const [hasVlookup, setHasVlookup] = useState(null)
	const [activeSheet, setActiveSheet] = useState<SheetModel>()
	let ssObj: SpreadsheetComponent

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files != null) {
			setSheetFile(e.target.files[0])
		}
	}

	const getData = async () => {
		const formData = new FormData()
		if (sheetFile) {
			formData.append('file', sheetFile)
		}
		const resp = await fetch('https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open', {
			method: 'POST',
			body: formData
		},)
		if (resp.ok) {
			const respJson = await resp.json()

			ssObj.openFromJson({ file: respJson })
		}
	}

	useEffect(() => {
		if (sheetFile) {
			getData()
		}
	}, [sheetFile])

	const testCustomFunction = (str: string) => {
		// return str + ' - Test'
		console.log(str)
	}

	const customVlookup = (lookupValue: any, tableRange: string, colIndex: number, isShorted: any) => {
		let spreadsheet = new Spreadsheet({})
		let tableRange_arr: any[] = tableRange.split(':')
		for (let i = 0; i < tableRange_arr.length; i++) {
			tableRange_arr[i] = cellNameToIndex(tableRange_arr[i])
		}
		// console.log(ssObj.getActiveSheet())
		for (let i = tableRange_arr[0][0]; i <= tableRange_arr[1][0]; i++) {
			if (getCell(i, tableRange_arr[0][1], spreadsheet.getActiveSheet()).value == lookupValue) {
				return getCell(i, tableRange_arr[0][1] + colIndex, spreadsheet.getActiveSheet()).value
			}
		}
		// return 100
		// let arr: string[] = []
		// const datas = await ssObj.getData(tableRange);
		// return datas.forEach((data, i) => {
		// 	// arr.push(data.value as string)
		// 	if (data.value == lookupValue) {
		// 		return data.value;
		// 	}
		// });
		// console.log(datas.keys())
		// console.log(arr)

		// return new Promise(async (resolve) => {
		// 	const datas = await ssObj.getData(tableRange);
		// 	datas.forEach((data, i) => {
		// 		if (data.value == lookupValue) {
		// 			resolve(data.value);
		// 		}
		// 	});
		// 	resolve(undefined); // Value not found
		// });

		// range.forEach((data) => {
		// 	arr.push(data.value as string)
		// })
		// if(arr[0]=='Manager'){
		// 	console.log('berhasil')
		// }
		// console.log(lookupValue)
		// for (let i = 0; i < arr.length; i++) {
		// 	if (arr[i] == lookupValue) {
		// 		console.log('berhasil')
		// 		// console.log(arr[i + 1])
		// 		// return arr[i + (colIndex - 1)];
		// 	}
		// }
	}

	useEffect(() => {
		setActiveSheet(ssObj.getActiveSheet())
		ssObj.addCustomFunction(testCustomFunction, 'TEST')
		ssObj.addCustomFunction(customVlookup, 'VLOOKUP')
	}, [])

	const testAction = async () => {
		// const x = await ssObj.getData('A1')
		// console.log(x)
		// ssObj.goTo('B5')
		// let cell: CellModel = getCell(0, 0, ssObj.getActiveSheet()); // rowIndex, colIndex, sheetIndex
		// const sheet = spreadsheet.getActiveSheet();

		// let cell: CellModel = getCell(3, 3, ssObj.getActiveSheet()); // rowIndex, colIndex, sheetIndex
		// const formula = cell.formula
		// vlookupTest(formula as string)
		console.log(ssObj.getIndexes('A1'))
	}

	const vlookupTest = async (formula: string) => {
		// const computed = ssObj.computeExpression('=G5+G6')
		// console.log(computed)
		// const selectedCell = await ssObj.getData('D4')
		// let cell: CellModel = getCell(3, 3, ssObj.getActiveSheet()); // rowIndex, colIndex, sheetIndex
		// const formula = cell.formula
		// const computed = ssObj.computeExpression(formula as string)
		// console.log(computed)
		const lookupValue = 'Manager'
		let arr: string[] = []
		const range = await ssObj.getData('F4:G6')
		range.forEach((data) => {
			arr.push(data.value as string)
		})
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === lookupValue) {
				// return arr[i + 1];
				console.log(arr[i + 1])
			}
		}
		// for (let i = 0; i < values.length; i++) {
		// 	if (values[i][0] === lookupValue) {
		// 		return values[i][colIndex - 1];
		// 	}
		// }

		return "#N/A"; // Value not found
	}

	const indexToCellName = (row: number, col: number) => {

		let dividend = col + 1;
		let columnName = '';
		let modulo;

		while (dividend > 0) {
			modulo = (dividend - 1) % 26;
			columnName = String.fromCharCode(65 + modulo) + columnName;
			dividend = Math.floor((dividend - modulo) / 26);
		}

		// Gabungkan bagian kolom dan baris untuk mendapatkan nama sel
		const cellName = columnName + (row + 1);
		return cellName

	}

	const cellNameToIndex = (cellName: string) => {
		if (cellName) {
			const column = cellName.match(/[A-Z]+/)![0];
			const row = parseInt(cellName.match(/[0-9]+/)![0]) - 1;

			let columnIndex = 0;
			for (let i = 0; i < column.length; i++) {
				columnIndex += (column.charCodeAt(i) - 65 + 1) * Math.pow(26, column.length - i - 1);
			}

			return [row, columnIndex - 1];
		}
	}

	return (
		<div className="App">
			<input
				type="file"
				name="sheet"
				id="sheet"
				onChange={handleFileChange}
				style={
					{
						margin: '10px',
					}
				}
			/>
			<button onClick={testAction}>Action Test</button>
			<SpreadsheetComponent
				showRibbon={false}
				ref={((s: SpreadsheetComponent) => ssObj = s)}
				allowOpen={true}
				height={'90%'}
				allowSave={true}
				scrollSettings={{
					isFinite: true,
					enableVirtualization: false
				}}
			>
			</SpreadsheetComponent>
		</div>
	);
}

export default App;