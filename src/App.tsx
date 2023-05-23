import './App.css';
// import {
// 	CellModel,
// 	RangeDirective, RangesDirective, SheetDirective, SheetModel, SheetsDirective,
// 	SpreadsheetComponent,
// 	getCell
// } from '@syncfusion/ej2-react-spreadsheet';
import {
	SpreadsheetComponent
} from '@syncfusion/ej2-react-spreadsheet';
// import { Spreadsheet } from '@syncfusion/ej2-react-spreadsheet';
import { ChangeEvent, useEffect, useState } from 'react';

function App() {
	const [sheetFile, setSheetFile] = useState<File | null>(null)
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

	const customVlookup = (lookupValue: any, tableRange: string, colIndex: number, isShorted: any) => {
		console.log(isShorted)
		let tableRange_arr: any[] = tableRange.split(':')
		for (let i = 0; i < tableRange_arr.length; i++) {
			tableRange_arr[i] = cellNameToIndex(tableRange_arr[i])
		}
		for (let i = tableRange_arr[0][0]; i <= tableRange_arr[1][0]; i++) {
			if (ssObj.computeExpression(`=${indexToCellName(i, tableRange_arr[0][1])}`) == lookupValue) {
				return ssObj.computeExpression(`=${indexToCellName(i, tableRange_arr[0][1] + (colIndex - 1))}`)
			}
		}

		// let arr: string[] = []
		// const datas = await ssObj.getData(tableRange);
		// return datas.forEach((data, i) => {
		// 	// arr.push(data.value as string)
		// 	if (data.value == lookupValue) {
		// 		return data.value;
		// 	}
		// });

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
		ssObj.addCustomFunction(customVlookup, 'VLOOKUP')
	}, [])

	const testAction = async () => {
		// console.log(ssObj.computeExpression('=B2:C4'))
		// console.log(ssObj.computeExpression('=A1+A2'))
		console.log(ssObj.computeExpression(`=${indexToCellName(3, 6)}`))
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