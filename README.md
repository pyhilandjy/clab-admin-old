# [Backend](https://github.com/pyhilandjy/Clab-api/blob/main/README.md)

# Frontend

## Next.js

### 페이지 설명
**해당 프론트는 개발자의 admin page가 아닌 음성파일의 STT 결과값을 수정하고 데이터를 정리하기 위한 페이지입니다.**

#### 1. /login
- Admin page 이기에 회원가입 기능은 없습니다.
- Supabase의 users 테이블의 id, pw, role_id를 조회하여 role_id == 1(admin)일 경우 접근이 가능합니다.
- /, /edit, /report 페이지는 로그인하지 않고 접근했을 경우 /login 페이지로 이동합니다.

#### 2. /
- main 페이지로 /report, /edit 페이지에 접근이 가능합니다.

#### 3. /edit
- **Naver clova STT의 결과값에 오타, 문장구분, 발화자 등 수정해야 할 부분을 수정을 해야 레포트의 퀄리티가 올라가므로 본 페이지를 생성했습니다.**
  - users 테이블의 id 보여주는 select box로 편집할 user_id를 선택합니다.
  - files 테이블에서 해당 유저의 file_id를 불러와 select box로 편집할 file_id를 선택합니다.
  - word replace는 동일한 오타를 한번에 처리하는 기능입니다. 수정하기 전 단어를 old word 수정 후 저장할 데이터를 new word에 입력을 하는 input box입니다.
  - speaker replace도 word replace와 같게 발화자를 한번에 처리하는 동일한 기능입니다.
  - user_id와 file_id를 선택했다면 DB에서 해당 데이터(stt_results)를 불러와 수정이 가능해집니다.
  - save 버튼은 해당 row의 오타를 수정 후 저장하는 버튼입니다.
  - add 버튼은 해당 row의 문장구분이 되어있지 않아 분리를 해야하는 경우 선택된 row의 데이터를 복사하여 해당 로우 밑에 복제하는 버튼입니다. 
    backend(pk는 id이고 index는 순서를 구분하기 위한 컬럼입니다. 선택된 로우의 index보다 큰 데이터를 +1 이후 생긴 공백에 index를 만들어 데이터를 추가합니다.)
  - delete 버튼은 필요없는 문장을 삭제하는 버튼입니다. 
    backend(삭제후 index는 선택된 데이터 이후의 index를 -1 합니다.)
  - 화행 select box는 문장별 화행을 선택할 수 있는 select box입니다.

#### 4. /report
- **유져별 녹음을 한 날짜를 기준으로 며칠부터 며칠까지의 데이터로 리포트를 작성하므로 해당 페이지를 생성했습니다.**
  - users 테이블의 id 보여주는 select box로 작성할 리포트의 user_id를 선택합니다.
  - 녹음일 기준으로 start_date, end_date를 지정하여 해당 데이터(stt_results)를 불러옵니다.
  - create report 버튼은 리포트에 필요한 가장 긴 문장, 평균 문장 길이, 녹음시간를 반환하는 버튼입니다.
  - create morps report 버튼은 리포트에 필요한 발화자별 품사 비율을 반환하는 버튼입니다.
  - create Actcount report 버튼은 리포트에 필요한 발화자별 화행 갯수를 반환하는 버튼입니다.
