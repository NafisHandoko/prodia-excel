import './App.css';
import {
	CellModel,
	RangeDirective, RangesDirective, SheetDirective, SheetsDirective,
	SpreadsheetComponent,
	getCell
} from '@syncfusion/ej2-react-spreadsheet';
import { ChangeEvent, useEffect, useState } from 'react';

function App() {
	const [sheetFile, setSheetFile] = useState<File | null>(null)
	let hasVLookUp = []
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

	const testAction = async () => {
		// const x = await ssObj.getData('A1')
		// console.log(x)
		// ssObj.goTo('B5')
		// let cell: CellModel = getCell(0, 0, ssObj.getActiveSheet()); // rowIndex, colIndex, sheetIndex
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

	function vlookup(lookupValue: any, table: any, colIndex: any, exactMatch: any) {
		for (let i = 0; i < table.length; i++) {
			if (exactMatch) {
				if (table[i][0] === lookupValue) {
					return table[i][colIndex - 1];
				}
			} else {
				if (table[i][0] == lookupValue) {
					return table[i][colIndex - 1];
				}
			}
		}
		return "#N/A"; // Value not found
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