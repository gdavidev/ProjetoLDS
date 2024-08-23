object frAvisos: TfrAvisos
  Left = 0
  Top = 0
  Width = 260
  Height = 429
  Align = alClient
  TabOrder = 0
  object Label1: TLabel
    Left = 55
    Top = 16
    Width = 152
    Height = 54
    Caption = 'EmuHub'
    Font.Charset = DEFAULT_CHARSET
    Font.Color = clWindowText
    Font.Height = -40
    Font.Name = 'Segoe UI'
    Font.Style = []
    ParentFont = False
  end
  object LabelGuia: TLabel
    Left = 6
    Top = 120
    Width = 246
    Height = 169
    Alignment = taCenter
    Caption = 
      'Controlador do EmuHub '#233' necess'#225'rio para a'#13'configura'#231#227'o deum ambi' +
      'ente controlado '#13'para garantir que os emuladorese ROMs '#13'funcione' +
      'm corretamente e se integrem com o '#13'site. O instalador configura' +
      ' todos os '#13'componentes essenciais, incluindo a associa'#231#227'o'#13'dos em' +
      'uladores com suas respectivas ROMs, '#13'e assegura que, ao clicar e' +
      'm um jogo no site,'#13'ele seja executado automaticamente no PC '#13'do ' +
      'usu'#225'rio. Sem essa instala'#231#227'o, o EmuHub'#13'n'#227'o pode garantir o funci' +
      'onamento correto'#13'dos jogos ou a integra'#231#227'o eficiente com os '#13'emu' +
      'ladores dispon'#237'veis.'
    Font.Charset = DEFAULT_CHARSET
    Font.Color = clWindowText
    Font.Height = -11
    Font.Name = 'Segoe UI'
    Font.Style = []
    ParentFont = False
  end
  object btnBack: TButton
    Left = 40
    Top = 384
    Width = 75
    Height = 25
    Caption = 'Close'
    TabOrder = 0
    OnClick = btnBackClick
  end
  object btnNext: TButton
    Left = 160
    Top = 384
    Width = 75
    Height = 25
    Caption = 'Next'
    Enabled = False
    TabOrder = 1
    OnClick = btnNextClick
  end
  object CheckBox1: TCheckBox
    Left = 18
    Top = 344
    Width = 239
    Height = 17
    Caption = 'Concordo com os termos e condi'#231#245'es.'
    ParentShowHint = False
    ShowHint = False
    TabOrder = 2
    OnClick = CheckBox1Click
  end
end
