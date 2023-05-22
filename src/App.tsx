import './App.css';
import {
	RangeDirective, RangesDirective, SheetDirective, SheetsDirective,
	SpreadsheetComponent
} from '@syncfusion/ej2-react-spreadsheet';
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