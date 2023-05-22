import './App.css';
import {
    RangeDirective, RangesDirective, SheetDirective, SheetsDirective,
    SpreadsheetComponent
} from '@syncfusion/ej2-react-spreadsheet';
import defaultData from './data'
import { ChangeEvent, useEffect, useRef, useState } from 'react';

function App() {
	const [sheetFile, setSheetFile] = useState<File | null>(null)
	const [sheetFile2, setSheetFile2] = useState<File | null>(null)

	const [fetchedJson, setFetchedJson] = useState<any>(null)
	let ssObj: SpreadsheetComponent

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files != null) {
			setSheetFile(e.target.files[0])
		}
	}

	const handleFileChange2 = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files != null) {

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
			setFetchedJson(respJson)
		}
	}

	const getData2 = async () => {
		if (sheetFile) {
			const resp = await ssObj.open({ file: sheetFile as File })
			console.log(resp)
		}
	}

	useEffect(() => {
		if (sheetFile) {
			getData2()
		}
	}, [sheetFile])

	return (
		<div className="App" style={{ marginTop: '60px', height: '100vh' }}>
			<div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
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
					{/* <input
						type="file"
						name="sheet"
						id="sheet"
						onChange={handleFileChange2}
						style={
							{
									margin: '10px',
							}
						}
					/> */}
			</div>
			<SpreadsheetComponent
					showRibbon={false}
					showFormulaBar={false}
					ref={((s: SpreadsheetComponent) => ssObj = s)}
					allowOpen={true}
					height={'90%'}
					openUrl="https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open"
					allowSave={true}
					saveUrl="https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save"
					sheets={fetchedJson ? fetchedJson.Workbook.sheets : []}
					scrollSettings={{
						isFinite: true,
						enableVirtualization: false
					}}
			>
					{/* <SheetsDirective>
						<SheetDirective>
							<RangesDirective>
									<RangeDirective dataSource={defaultData.slice(0, 5)}></RangeDirective>
							</RangesDirective>
						</SheetDirective>
					</SheetsDirective> */}
			</SpreadsheetComponent>
		</div>
	);
}

export default App;