import './App.css';
import {
  RangeDirective, RangesDirective, SheetDirective, SheetsDirective,
  SpreadsheetComponent
} from '@syncfusion/ej2-react-spreadsheet';
import defaultData from './data'

function App() {
  return (
    <div className="App" style={{ marginTop: '60px', height: '100vh' }}>
      <SpreadsheetComponent
        allowOpen={true}
        height={'90%'}
        openUrl="https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open"
        allowSave={true}
        saveUrl="https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save"
      >
        <SheetsDirective>
          <SheetDirective>
            <RangesDirective>
              <RangeDirective dataSource={defaultData}></RangeDirective>
            </RangesDirective>
          </SheetDirective>
        </SheetsDirective>
      </SpreadsheetComponent>
    </div>
  );
}

export default App;