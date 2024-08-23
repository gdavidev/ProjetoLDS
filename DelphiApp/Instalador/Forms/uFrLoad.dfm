object frLoad: TfrLoad
  Left = 0
  Top = 0
  Width = 260
  Height = 429
  Align = alClient
  TabOrder = 0
  OnResize = FrameResize
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
  object ProgressBar1: TProgressBar
    Left = 16
    Top = 184
    Width = 225
    Height = 33
    TabOrder = 0
  end
  object btnNext: TButton
    Left = 88
    Top = 384
    Width = 75
    Height = 25
    Caption = 'Finish'
    TabOrder = 1
    Visible = False
    OnClick = btnNextClick
  end
end
