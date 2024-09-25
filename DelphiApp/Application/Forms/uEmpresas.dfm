object formEmpresas: TformEmpresas
  Left = 0
  Top = 0
  Align = alClient
  BorderStyle = bsNone
  Caption = 'formEmpresas'
  ClientHeight = 480
  ClientWidth = 640
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -12
  Font.Name = 'Segoe UI'
  Font.Style = []
  Position = poDesktopCenter
  OnCreate = FormCreate
  OnResize = FormResize
  TextHeight = 15
  object pnlPrincipal: TPanel
    Left = 0
    Top = 0
    Width = 640
    Height = 480
    Align = alClient
    TabOrder = 0
    object pnlEmpresasUp: TPanel
      Left = 1
      Top = 1
      Width = 638
      Height = 240
      Align = alTop
      BevelOuter = bvNone
      TabOrder = 0
      object pnlNintendo: TPanel
        Left = 0
        Top = 0
        Width = 320
        Height = 240
        Align = alLeft
        BevelOuter = bvNone
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -12
        Font.Name = 'Pretendo'
        Font.Style = []
        ParentFont = False
        TabOrder = 0
        object btnNintendo: TSpeedButton
          Left = 80
          Top = 90
          Width = 153
          Height = 57
          Caption = 'Nintendo'
          Enabled = False
          Font.Charset = DEFAULT_CHARSET
          Font.Color = clRed
          Font.Height = -12
          Font.Name = 'Pretendo'
          Font.Style = []
          ParentFont = False
          OnClick = btnNintendoClick
        end
      end
      object pnlSega: TPanel
        Left = 318
        Top = 0
        Width = 320
        Height = 240
        Align = alRight
        BevelOuter = bvNone
        TabOrder = 1
        object btnSega: TSpeedButton
          Left = 112
          Top = 90
          Width = 97
          Height = 57
          Caption = 'Sega'#13
          Enabled = False
          Font.Charset = DEFAULT_CHARSET
          Font.Color = clWindowText
          Font.Height = -12
          Font.Name = 'Sage'
          Font.Style = []
          ParentFont = False
        end
      end
    end
    object pnlEmpresasDown: TPanel
      Left = 1
      Top = 239
      Width = 638
      Height = 240
      Align = alBottom
      BevelOuter = bvNone
      TabOrder = 1
      object pnlMicrosoft: TPanel
        Left = 0
        Top = 0
        Width = 320
        Height = 240
        Align = alLeft
        BevelOuter = bvNone
        TabOrder = 0
        object btnMicrosoft: TSpeedButton
          Left = 96
          Top = 120
          Width = 71
          Height = 22
          Caption = 'Microsoft'
          Enabled = False
          Font.Charset = DEFAULT_CHARSET
          Font.Color = clChartreuse
          Font.Height = -12
          Font.Name = 'Segoe Pro'
          Font.Style = [fsBold]
          ParentFont = False
        end
      end
      object pnlSony: TPanel
        Left = 318
        Top = 0
        Width = 320
        Height = 240
        Align = alRight
        BevelOuter = bvNone
        TabOrder = 1
        object btnSony: TSpeedButton
          Left = 120
          Top = 128
          Width = 81
          Height = 22
          Caption = 'Sony'
          Enabled = False
          Font.Charset = DEFAULT_CHARSET
          Font.Color = clNavy
          Font.Height = -12
          Font.Name = 'Clarendon'
          Font.Style = []
          ParentFont = False
        end
      end
    end
  end
end
