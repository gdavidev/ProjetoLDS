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
  Visible = True
  OnResize = FormResize
  TextHeight = 15
  object pnlEmpresas: TPanel
    Left = 0
    Top = 0
    Width = 640
    Height = 480
    Align = alClient
    TabOrder = 0
    ExplicitLeft = 256
    ExplicitTop = 200
    ExplicitWidth = 185
    ExplicitHeight = 41
    object pnlEmpresasUp: TPanel
      Left = 1
      Top = 1
      Width = 638
      Height = 240
      Align = alTop
      TabOrder = 0
      ExplicitTop = 0
      object pnlNintendo: TPanel
        Left = 1
        Top = 1
        Width = 320
        Height = 238
        Align = alLeft
        Caption = 'pnlNintendo'
        TabOrder = 0
      end
      object pnlSega: TPanel
        Left = 317
        Top = 1
        Width = 320
        Height = 238
        Align = alRight
        Caption = 'pnlSega'
        TabOrder = 1
        ExplicitLeft = 452
      end
    end
    object pnlEmpresasDown: TPanel
      Left = 1
      Top = 239
      Width = 638
      Height = 240
      Align = alBottom
      TabOrder = 1
      ExplicitTop = 159
      object pnlMicrosoft: TPanel
        Left = 1
        Top = 1
        Width = 320
        Height = 238
        Align = alLeft
        Caption = 'pnlMicrosoft'
        TabOrder = 0
      end
      object pnlSony: TPanel
        Left = 317
        Top = 1
        Width = 320
        Height = 238
        Align = alRight
        Caption = 'pnlSony'
        TabOrder = 1
        ExplicitLeft = 452
      end
    end
  end
end
