import pandas as pd
import os

def analyze_car_data():
    file_path = r'c:\Users\nx280\Desktop\car_full_database_v3.csv'
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found")
        return
        
    df = pd.read_csv(file_path)
    
    print("-" * 40)
    print("      [ 실제 차량 연식(YEAR) 분포 ]")
    print("-" * 40)
    # 연도별 데이터 수 출력 (상위 10개)
    year_counts = df['YEAR'].value_counts().sort_index(ascending=False)
    for year, count in year_counts.items():
        print(f" 연도: {year}년 | 대수: {count:>3}대")
    
    print("-" * 40)
    print(f" 총 데이터 수: {len(df)}건")
    print("-" * 40)
    print("💡 DATA_REG_DT는 공공기관 DB에 등록된 날짜이며,")
    print("   실제 차량 출시 연도는 YEAR 컬럼에 정상적으로 담겨 있습니다.")

if __name__ == "__main__":
    analyze_car_data()
