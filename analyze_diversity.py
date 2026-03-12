import pandas as pd
import os

def check_data_diversity():
    file_path = r'c:\Users\nx280\Desktop\car_full_database_v3.csv'
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found")
        return
        
    df = pd.read_csv(file_path)
    
    print("=" * 50)
    print("      [ 수집된 자동차 데이터셋 종합 분석 ]")
    print("=" * 50)
    
    # 1. 제조사 분포 (상위 15개)
    print("\n[1] 주요 제조사별 분포 (Top 15)")
    comp_counts = df['COMP_NM'].value_counts().head(15)
    for comp, count in comp_counts.items():
        print(f" - {comp:<15}: {count:>3}대")
        
    # 2. 유종별 분포
    print("\n[2] 유종(연료)별 분포")
    fuel_counts = df['FUEL_NM'].value_counts()
    for fuel, count in fuel_counts.items():
        print(f" - {fuel:<15}: {count:>3}대")
        
    # 3. 차종별 분포
    print("\n[3] 차종(승용/화물 등)별 분포")
    car_kind_counts = df['CAR_KIND'].value_counts()
    for kind, count in car_kind_counts.items():
        print(f" - {kind:<15}: {count:>3}대")

    # 4. 연도별 요약 (최근 5년 위주)
    print("\n[4] 출시 연도별 분포 (최근 10년)")
    year_counts = df['YEAR'].value_counts().sort_index(ascending=False).head(10)
    for year, count in year_counts.items():
        print(f" - {year}년식           : {count:>3}대")

    print("\n" + "=" * 50)
    print(f" 총 수집 차량: {len(df)}대")
    print("=" * 50)

if __name__ == "__main__":
    check_data_diversity()
