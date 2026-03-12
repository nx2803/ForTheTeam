import pandas as pd
import os

def analyze_new_csv():
    file_path = r'c:\Users\nx280\Desktop\자동차표시연비 목록.csv'
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found")
        return
        
    try:
        # 파일이 utf-8-sig 또는 cp949일 수 있음
        try:
            df = pd.read_csv(file_path, encoding='utf-8-sig')
        except:
            df = pd.read_csv(file_path, encoding='cp949')
            
        print("=" * 50)
        print("      [ 새로 발견된 CSV 파일 분석 결과 ]")
        print("=" * 50)
        
        # 출시연도 분포
        if '출시연도' in df.columns:
            print("\n[1] 출시연도별 데이터 분포")
            year_counts = df['출시연도'].value_counts().sort_index(ascending=False)
            for year, count in year_counts.items():
                print(f" - {year}년식           : {count:>3}대")
        
        # 유종 분포
        if '연료' in df.columns:
            print("\n[2] 유종별 데이터 분포")
            fuel_counts = df['연료'].value_counts()
            for fuel, count in fuel_counts.items():
                print(f" - {fuel:<15}: {count:>3}대")

        print("\n" + "=" * 50)
        print(f" 총 데이터 수: {len(df)}건")
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ 분석 중 오류 발생: {e}")

if __name__ == "__main__":
    analyze_new_csv()
