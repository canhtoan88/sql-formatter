import { useRef } from 'react';
import { Button, Input, Notify } from 'cant-ui/core';
import { ThemeProvider } from 'cant-ui/theme';
import { format } from 'sql-formatter';
import './App.css';

function App() {
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const notifyRef = useRef(null);

  const onFormatHandler = () => {
    const input = inputRef.current.value;

    if (input) {
      let [output, params] = input.split(/\s?-- PARAMETERS:\s?/);
      params = params
              ? JSON.parse(params).map(t => typeof t === 'string' ? "'" + t + "'" : t)
              : [];
      const replaced = output.replace(/\$\d+/g, w => {
        const index = w.replace('$', '') - 1;
        return params[index];
      })
      outputRef.current.setValue(format(replaced, {
        params,
        language: 'postgresql',
        tabWidth: 4,
        keywordCase: 'upper',
      }));
    }
  }

  const onCopyHandler = () => {
    outputRef.current.querySelector('textarea').select();
    document.execCommand('copy');
    notifyRef.current.add();
  }

  return (
    <ThemeProvider className={'App'}>
        <header className="App-header">
          <Input inputRef={inputRef} multiline fullWidth center variant={'box'} rows={5} maxRows={10} />
          <Button onClick={onFormatHandler} color={'warning'} style={{margin: 16}}>FORMAT</Button>
          <Button onClick={onCopyHandler} color={'success'} style={{margin: 16}}>COPY</Button>
          <Input ref={outputRef} multiline fullWidth center variant={'box'} rows={5} maxRows={10} readOnly />
        </header>
        <Notify
          ref={notifyRef}
          position={{
            vertical: 'top',
            horizontal: 'right'
          }}
          content={'Copied!!'}
          size={'small'}
          width={200}
          duration={2}
        />
    </ThemeProvider>
  );
}

export default App;
