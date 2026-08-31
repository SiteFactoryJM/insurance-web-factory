"""Generate the Korean insurance-agent intake workbook with artifact_tool."""
from __future__ import annotations

import json
import os
from pathlib import Path

os.environ.setdefault("ARTIFACT_TOOL_RPC_DAEMON_STARTUP_TIMEOUT_S", "180")
from artifact_tool import SpreadsheetFile, Workbook  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "forms" / "보험설계사_홈페이지_자료수집_양식.xlsx"
SPEC = json.loads((ROOT / "config" / "intake-fields.json").read_text(encoding="utf-8"))
FIELDS = SPEC["fields"]

NAVY = "#18324A"
BLUE = "#1E5AA8"
LIGHT_BLUE = "#EAF2FB"
PALE_BLUE = "#F5F9FD"
GOLD = "#B6924E"
GREEN = "#147D53"
PALE_GREEN = "#EAF7F1"
YELLOW = "#FFF8D8"
RED = "#B42318"
PALE_RED = "#FDECEC"
GRAY = "#5F6B7A"
LIGHT_GRAY = "#EEF2F6"
LINE = "#D5DEE8"
WHITE = "#FFFFFF"
INK = "#142033"
FONT = "맑은 고딕"

THIN = {
    "top": {"style": "thin", "color": LINE},
    "bottom": {"style": "thin", "color": LINE},
    "left": {"style": "thin", "color": LINE},
    "right": {"style": "thin", "color": LINE},
}
TITLE = {
    "fill": NAVY,
    "font": {"name": FONT, "bold": True, "color": WHITE, "size": 20},
    "horizontal_alignment": "left",
    "vertical_alignment": "center",
}
SUBTITLE = {
    "fill": NAVY,
    "font": {"name": FONT, "color": "#DCE8F3", "size": 10},
    "vertical_alignment": "center",
}
SECTION = {
    "fill": BLUE,
    "font": {"name": FONT, "bold": True, "color": WHITE, "size": 11},
    "vertical_alignment": "center",
}
HEADER = {
    "fill": "#DDE9F5",
    "font": {"name": FONT, "bold": True, "color": INK, "size": 10},
    "horizontal_alignment": "center",
    "vertical_alignment": "center",
    "borders": {"bottom": {"style": "thin", "color": "#AFC2D6"}},
}


def title_block(sheet, title: str, subtitle: str, last_col: str) -> None:
    sheet.merge_cells(f"A1:{last_col}2")
    sheet.get_range("A1").values = [[title]]
    sheet.get_range(f"A1:{last_col}2").format = TITLE
    sheet.merge_cells(f"A3:{last_col}3")
    sheet.get_range("A3").values = [[subtitle]]
    sheet.get_range(f"A3:{last_col}3").format = SUBTITLE
    sheet.get_range(f"A1:{last_col}2").format.row_height = 34
    sheet.get_range(f"A3:{last_col}3").format.row_height = 25


def section_row(sheet, row: int, title: str, last_col: str) -> None:
    sheet.merge_cells(f"A{row}:{last_col}{row}")
    sheet.get_range(f"A{row}").values = [[title]]
    sheet.get_range(f"A{row}:{last_col}{row}").format = SECTION
    sheet.get_range(f"A{row}:{last_col}{row}").format.row_height = 24


def build() -> tuple[Workbook, int, int]:
    wb = Workbook.create()
    guide = wb.worksheets.add("안내")
    form = wb.worksheets.add("작성양식")
    templates = wb.worksheets.add("템플릿안내")
    check = wb.worksheets.add("제출전확인")
    for sheet in (guide, form, templates, check):
        sheet.get_range("A1:Z220").format.font = {"name": FONT, "size": 10, "color": INK}

    # 안내
    title_block(
        guide,
        "보험설계사 홈페이지 자료수집 양식",
        "이 파일 한 개와 프로필 사진을 제출하면 홈페이지 설정 파일을 자동 생성할 수 있습니다.",
        "F",
    )
    section_row(guide, 5, "작성 순서", "F")
    guide.get_range("A6:C10").values = [
        ["1", "템플릿 선택", "‘템플릿안내’ 시트에서 원하는 디자인 1개를 고릅니다."],
        ["2", "노란색 칸 작성", "‘작성양식’ 시트의 E열 노란색 칸만 작성합니다."],
        ["3", "사진 함께 제출", "엑셀과 같은 폴더에 프로필 사진을 넣고 정확한 파일명을 적습니다."],
        ["4", "제출 전 확인", "‘제출전확인’ 시트에서 필수 항목과 동의 상태를 확인합니다."],
        ["5", "검수 후 게시", "초안 확인과 소속 회사/GA의 준법 검토 후 도메인에 연결합니다."],
    ]
    guide.get_range("A6:A10").format = {
        "fill": LIGHT_BLUE,
        "font": {"name": FONT, "bold": True, "color": BLUE, "size": 12},
        "horizontal_alignment": "center",
        "vertical_alignment": "center",
        "borders": THIN,
    }
    guide.get_range("B6:B10").format = {
        "font": {"name": FONT, "bold": True, "color": INK},
        "vertical_alignment": "center",
        "borders": THIN,
    }
    guide.get_range("C6:C10").format = {
        "font": {"name": FONT, "color": GRAY},
        "wrap_text": True,
        "vertical_alignment": "center",
        "borders": THIN,
    }
    section_row(guide, 12, "꼭 확인해 주세요", "F")
    guide.get_range("A13:C17").values = [
        ["●", "프로필 사진", "정면을 바라보는 상반신 사진, 세로 3:4 또는 4:5 비율, JPG·PNG·WEBP 권장"],
        ["●", "사실 확인", "소속, 경력, 수상, 자격, 상담 가능 지역은 증빙 가능한 사실만 작성"],
        ["●", "준법 검토", "보험상품 또는 보장 내용을 홍보하는 문구는 소속 회사/GA 심의 기준에 따라 확정"],
        ["●", "개인정보", "상담 폼 운영 시 담당자·보유기간·처리 절차를 실제 정책과 일치시킴"],
        ["●", "수정 가능", "문구, 순서, 색상, 사진, 표시 영역은 초안 확인 후 세부 조정 가능"],
    ]
    guide.get_range("A13:A17").format = {
        "font": {"name": FONT, "color": GOLD, "bold": True},
        "horizontal_alignment": "center",
        "vertical_alignment": "top",
    }
    guide.get_range("B13:B17").format = {
        "font": {"name": FONT, "bold": True, "color": INK},
        "vertical_alignment": "top",
    }
    guide.get_range("C13:C17").format = {
        "font": {"name": FONT, "color": GRAY},
        "wrap_text": True,
        "vertical_alignment": "top",
    }
    section_row(guide, 19, "파일 제출 예시", "F")
    guide.get_range("A20:C23").values = [
        ["폴더", "kim-haneul/", "엑셀과 이미지를 한 폴더에 넣습니다."],
        ["엑셀", "김하늘_홈페이지자료.xlsx", "작성 완료된 이 파일"],
        ["사진", "profile.jpg", "프로필 사진 파일"],
        ["선택", "logo.png / og-image.jpg", "로고 또는 공유 이미지가 있을 때만"],
    ]
    guide.get_range("A20:C23").format = {"borders": THIN, "vertical_alignment": "center", "wrap_text": True}
    guide.get_range("A20:A23").format = {
        "fill": LIGHT_GRAY,
        "font": {"name": FONT, "bold": True, "color": INK},
        "borders": THIN,
    }
    guide.get_range("B20:B23").format = {
        "font": {"name": FONT, "bold": True, "color": BLUE},
        "borders": THIN,
    }
    guide.get_range("C20:C23").format = {"font": {"name": FONT, "color": GRAY}, "borders": THIN}
    guide.get_range("A1:A23").format.column_width = 8
    guide.get_range("B1:B23").format.column_width = 24
    guide.get_range("C1:C23").format.column_width = 70
    guide.get_range("D1:F23").format.column_width = 4
    guide.get_range("A6:C10").format.row_height = 34
    guide.get_range("A13:C17").format.row_height = 36
    guide.freeze_panes.freeze_rows(3)

    # 작성양식
    title_block(
        form,
        "홈페이지 작성양식",
        "E열의 노란색 ‘작성란’만 입력하세요. 시스템키(A열)는 자동 변환에 사용되므로 수정하지 마세요.",
        "G",
    )
    form.get_range("A4:G4").values = [["시스템키", "구분", "작성 항목", "필수", "작성란", "작성 예시", "안내"]]
    form.get_range("A4:G4").format = HEADER
    form.get_range("A4:G4").format.row_height = 27

    row = 5
    required_rows: list[int] = []
    key_to_row: dict[str, int] = {}
    current_section = None
    for field in FIELDS:
        if field["section"] != current_section:
            current_section = field["section"]
            section_row(form, row, current_section, "G")
            row += 1
        key_to_row[field["key"]] = row
        form.get_range(f"A{row}:G{row}").values = [[
            field["key"],
            field["section"],
            field["label"],
            "필수" if field.get("required") else "선택",
            field.get("default", ""),
            field.get("example", ""),
            field.get("help", ""),
        ]]
        form.get_range(f"A{row}:G{row}").format = {
            "borders": THIN,
            "vertical_alignment": "center",
            "wrap_text": True,
        }
        form.get_range(f"A{row}").format = {
            "fill": LIGHT_GRAY,
            "font": {"name": FONT, "color": "#7B8795", "size": 8},
            "borders": THIN,
        }
        form.get_range(f"B{row}").format = {
            "fill": PALE_BLUE,
            "font": {"name": FONT, "color": GRAY, "size": 9},
            "borders": THIN,
        }
        form.get_range(f"C{row}").format = {
            "font": {"name": FONT, "bold": True, "color": INK},
            "borders": THIN,
        }
        form.get_range(f"D{row}").format = {
            "fill": PALE_RED if field.get("required") else LIGHT_GRAY,
            "font": {
                "name": FONT,
                "bold": True,
                "color": RED if field.get("required") else GRAY,
                "size": 9,
            },
            "horizontal_alignment": "center",
            "borders": THIN,
        }
        form.get_range(f"E{row}").format = {
            "fill": YELLOW,
            "font": {"name": FONT, "color": INK},
            "borders": {
                "top": {"style": "thin", "color": "#D9C46B"},
                "bottom": {"style": "thin", "color": "#D9C46B"},
                "left": {"style": "thin", "color": "#D9C46B"},
                "right": {"style": "thin", "color": "#D9C46B"},
            },
        }
        form.get_range(f"F{row}").format = {
            "font": {"name": FONT, "color": "#627386", "italic": True, "size": 9},
            "borders": THIN,
        }
        form.get_range(f"G{row}").format = {
            "font": {"name": FONT, "color": GRAY, "size": 9},
            "borders": THIN,
        }
        form.get_range(f"A{row}:G{row}").format.row_height = 36
        if field.get("options"):
            form.get_range(f"E{row}").data_validation = {
                "rule": {"type": "list", "values": field["options"]}
            }
        if field.get("required"):
            required_rows.append(row)
            form.get_range(f"E{row}").conditional_formats.add_custom(
                f'=AND($D{row}="필수",$E{row}="")',
                {"fill": PALE_RED, "font": {"color": RED}},
            )
        row += 1

    last_form_row = row - 1
    for col, width in {"A": 16, "B": 15, "C": 24, "D": 8, "E": 34, "F": 36, "G": 48}.items():
        form.get_range(f"{col}1:{col}{last_form_row}").format.column_width = width
    form.freeze_panes.freeze_rows(4)
    form.freeze_panes.freeze_columns(4)

    # 템플릿안내
    title_block(
        templates,
        "5가지 홈페이지 템플릿 안내",
        "템플릿은 전체 인상과 레이아웃을 정합니다. 사진·문구·색상·노출 영역은 설계사별로 세부 변경할 수 있습니다.",
        "F",
    )
    templates.get_range("A5:F5").values = [["템플릿 값", "한글 이름", "추천 대상", "주요 인상", "기본 포인트", "변경 가능 사항"]]
    templates.get_range("A5:F5").format = HEADER
    templates.get_range("A6:F10").values = [
        ["trust-blue", "신뢰 블루", "가장 범용적인 소개 페이지", "정돈됨 · 전문성 · 안정감", "#1E5AA8", "문구, 색상, 순서, 사진, 노출 영역"],
        ["warm-care", "따뜻한 케어", "가족·건강 상담을 부드럽게 전달", "친절함 · 편안함 · 공감", "#557A62", "문구, 색상, 곡선 정도, 사진, 노출 영역"],
        ["premium-navy", "프리미엄 네이비", "경력과 전문성을 강하게 강조", "고급스러움 · 깊이 · 신뢰", "#B6924E", "문구, 골드 톤, 경력 강조, 사진, 노출 영역"],
        ["clean-minimal", "클린 미니멀", "간결한 개인 브랜딩 선호", "선명함 · 현대적 · 절제", "#222222", "문구, 여백, 색상, 사진 비율, 노출 영역"],
        ["local-friendly", "지역 친화", "지역 밀착형 상담과 쉬운 연락 강조", "친근함 · 생동감 · 접근성", "#158273", "지역 문구, 색상, 상담 버튼, 사진, 노출 영역"],
    ]
    templates.get_range("A6:F10").format = {"borders": THIN, "wrap_text": True, "vertical_alignment": "center"}
    templates.get_range("A6:A10").format = {"font": {"name": FONT, "bold": True, "color": BLUE}, "borders": THIN}
    templates.get_range("B6:B10").format = {"font": {"name": FONT, "bold": True, "color": INK, "size": 11}, "borders": THIN}
    templates.get_range("C6:D10").format = {"font": {"name": FONT, "color": GRAY}, "borders": THIN}
    templates.get_range("F6:F10").format = {"font": {"name": FONT, "color": GRAY, "size": 9}, "borders": THIN}
    for r, color in zip(range(6, 11), ["#1E5AA8", "#557A62", "#B6924E", "#222222", "#158273"]):
        templates.get_range(f"E{r}").format = {
            "fill": color,
            "font": {"name": FONT, "bold": True, "color": WHITE},
            "horizontal_alignment": "center",
            "borders": THIN,
        }
    section_row(templates, 12, "선택 기준", "F")
    templates.get_range("A13:B17").values = [
        ["정돈되고 무난하게", "trust-blue"],
        ["부드럽고 따뜻하게", "warm-care"],
        ["경력과 전문성을 강하게", "premium-navy"],
        ["간결하고 세련되게", "clean-minimal"],
        ["지역 고객에게 친근하게", "local-friendly"],
    ]
    templates.get_range("A13:B17").format = {"borders": THIN}
    templates.get_range("A13:A17").format = {
        "fill": PALE_BLUE,
        "font": {"name": FONT, "bold": True, "color": INK},
        "borders": THIN,
    }
    templates.get_range("B13:B17").format = {
        "font": {"name": FONT, "bold": True, "color": BLUE},
        "borders": THIN,
    }
    for col, width in {"A": 20, "B": 20, "C": 31, "D": 29, "E": 17, "F": 43}.items():
        templates.get_range(f"{col}1:{col}17").format.column_width = width
    templates.get_range("A6:F10").format.row_height = 48
    templates.freeze_panes.freeze_rows(5)

    # 제출전확인
    title_block(
        check,
        "제출 전 자동 확인",
        "아래 상태가 모두 정상인지 확인한 뒤 엑셀과 이미지 파일을 함께 제출하세요.",
        "E",
    )
    check.get_range("A5:C5").values = [["검사 항목", "결과", "설명"]]
    check.get_range("A5:C5").format = HEADER
    check_rows = [
        ["전체 필수 항목 수", f'=COUNTIF(\'작성양식\'!D5:D{last_form_row},"필수")', "작성해야 하는 필수 항목의 총 개수"],
        ["비어 있는 필수 항목", f'=COUNTIFS(\'작성양식\'!D5:D{last_form_row},"필수",\'작성양식\'!E5:E{last_form_row},"")', "0이어야 제출 가능합니다."],
        ["기재 내용 사실 확인", f"='작성양식'!E{key_to_row['content_truth_confirmed']}", "‘예’여야 실제 게시할 수 있습니다."],
        ["사진/로고 사용권 확인", f"='작성양식'!E{key_to_row['photo_use_confirmed']}", "‘예’여야 실제 게시할 수 있습니다."],
        ["홈페이지 게시 동의", f"='작성양식'!E{key_to_row['publication_confirmed']}", "‘예’여야 실제 게시할 수 있습니다."],
        ["광고심의 상태", f"='작성양식'!E{key_to_row['advertising_review_status']}", "published 전 소속 회사/GA 기준을 확인합니다."],
    ]
    check.get_range("A6:C11").values = [[r[0], None, r[2]] for r in check_rows]
    check.get_range("B6:B11").formulas = [[r[1]] for r in check_rows]
    check.get_range("A6:C11").format = {"borders": THIN, "vertical_alignment": "center", "wrap_text": True}
    check.get_range("A6:A11").format = {
        "fill": PALE_BLUE,
        "font": {"name": FONT, "bold": True, "color": INK},
        "borders": THIN,
    }
    check.get_range("B6:B11").format = {
        "font": {"name": FONT, "bold": True, "color": BLUE, "size": 12},
        "horizontal_alignment": "center",
        "borders": THIN,
    }
    check.get_range("C6:C11").format = {"font": {"name": FONT, "color": GRAY}, "borders": THIN}
    check.get_range("B7").conditional_formats.add_cell_is({
        "operator": "greaterThan",
        "formula": 0,
        "format": {"fill": PALE_RED, "font": {"color": RED, "bold": True}},
    })
    check.get_range("B8:B10").conditional_formats.add_custom(
        '=B8<>"예"', {"fill": PALE_RED, "font": {"color": RED}}
    )
    section_row(check, 13, "최종 상태", "C")
    check.merge_cells("A14:C16")
    check.get_range("A14").formulas = [[
        '=IF(AND(B7=0,B8="예",B9="예",B10="예"),"제출 가능","작성양식을 다시 확인해 주세요")'
    ]]
    check.get_range("A14:C16").format = {
        "fill": PALE_GREEN,
        "font": {"name": FONT, "bold": True, "color": GREEN, "size": 17},
        "horizontal_alignment": "center",
        "vertical_alignment": "center",
        "borders": THIN,
    }
    check.get_range("A14:C16").conditional_formats.add_custom(
        '=$A$14<>"제출 가능"', {"fill": PALE_RED, "font": {"color": RED, "bold": True}}
    )
    section_row(check, 18, "제출 파일 체크리스트", "C")
    check.get_range("A19:C22").values = [
        ["□", "작성 완료 엑셀", "파일명 예: 김하늘_홈페이지자료.xlsx"],
        ["□", "프로필 사진", "작성양식에 적은 파일명과 실제 파일명이 동일해야 합니다."],
        ["□", "로고/공유 이미지", "작성한 경우에만 함께 제출합니다."],
        ["□", "준법 승인 자료", "실제 게시 전 필요한 경우 심의번호와 승인 문구를 전달합니다."],
    ]
    check.get_range("A19:C22").format = {"borders": THIN, "wrap_text": True, "vertical_alignment": "center"}
    check.get_range("A19:A22").format = {
        "font": {"name": FONT, "bold": True, "color": BLUE, "size": 14},
        "horizontal_alignment": "center",
        "borders": THIN,
    }
    check.get_range("B19:B22").format = {"font": {"name": FONT, "bold": True, "color": INK}, "borders": THIN}
    check.get_range("C19:C22").format = {"font": {"name": FONT, "color": GRAY}, "borders": THIN}
    for col, width in {"A": 27, "B": 22, "C": 60, "D": 5, "E": 5}.items():
        check.get_range(f"{col}1:{col}22").format.column_width = width
    check.get_range("A6:C11").format.row_height = 34
    check.get_range("A19:C22").format.row_height = 34
    check.freeze_panes.freeze_rows(5)

    return wb, last_form_row, len(required_rows)


if __name__ == "__main__":
    workbook, last_row, required_count = build()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    SpreadsheetFile.export_xlsx(workbook).save(str(OUT))
    print(f"created={OUT}")
    print(f"form_rows={last_row} required={required_count} size={OUT.stat().st_size}")
