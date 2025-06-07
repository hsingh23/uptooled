const { useState, useEffect } = React;
const { Container, Box, Grid, TextField, Card, CardContent, Typography } = MaterialUI;

function App() {
  const [tools, setTools] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('tools.json')
      .then(res => res.json())
      .then(setTools);
  }, []);

  const filtered = tools.filter(t => {
    const lower = query.toLowerCase();
    return (
      t.title.toLowerCase().includes(lower) ||
      t.description.toLowerCase().includes(lower) ||
      (t.keywords || []).some(k => k.toLowerCase().includes(lower))
    );
  });

  return (
    React.createElement(Container, { sx: { py: 4 } },
      React.createElement(Box, { sx: { mb: 2 } },
        React.createElement(TextField, {
          fullWidth: true,
          label: 'Search tools',
          variant: 'outlined',
          value: query,
          onChange: e => setQuery(e.target.value)
        })
      ),
      React.createElement(Grid, { container: true, spacing: 2 },
        filtered.map(tool => (
          React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 4, key: tool.file },
            React.createElement(Card, null,
              React.createElement('iframe', {
                src: tool.file,
                style: { width: '100%', height: '200px', border: 0 }
              }),
              React.createElement(CardContent, null,
                React.createElement(Typography, { variant: 'h6' }, tool.title),
                React.createElement(Typography, { variant: 'body2', sx: { mb: 1 } }, tool.description),
                tool.keywords && tool.keywords.length > 0 &&
                  React.createElement(Typography, { variant: 'caption', color: 'text.secondary' },
                    'Keywords: ' + tool.keywords.join(', ')
                  )
              )
            )
          )
        ))
      )
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
